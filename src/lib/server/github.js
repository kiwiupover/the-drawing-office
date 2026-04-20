import { env } from '$env/dynamic/private';

const API_BASE = 'https://api.github.com';
const USER_AGENT = 'drawing-office-studio';

function config() {
	const token = env.GITHUB_TOKEN;
	const owner = env.GITHUB_OWNER;
	const repo = env.GITHUB_REPO;
	const branch = env.GITHUB_BRANCH;
	if (!token || !owner || !repo || !branch) {
		throw new Error('GitHub env vars missing: need GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH');
	}
	return { token, owner, repo, branch };
}

/**
 * @param {string} path
 * @param {RequestInit & { token: string }} options
 */
async function gh(path, { token, ...options }) {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': USER_AGENT,
			'Content-Type': 'application/json',
			...(options.headers ?? {})
		}
	});
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`GitHub ${options.method ?? 'GET'} ${path} failed: ${res.status} ${body.slice(0, 200)}`);
	}
	return res.json();
}

/**
 * @param {{ files: Array<{ path: string; contents: string }>; message: string }} input
 * @returns {Promise<{ ok: true; commitSha: string }>}
 */
export async function commitFiles({ files, message }) {
	if (!files.length) throw new Error('commitFiles: no files provided');
	const { token, owner, repo, branch } = config();
	const repoPath = `/repos/${owner}/${repo}`;

	const ref = await gh(`${repoPath}/git/ref/heads/${branch}`, { token });
	const parentSha = ref.object.sha;

	const parentCommit = await gh(`${repoPath}/git/commits/${parentSha}`, { token });
	const baseTreeSha = parentCommit.tree.sha;

	const blobs = await Promise.all(
		files.map(async (f) => {
			const blob = await gh(`${repoPath}/git/blobs`, {
				token,
				method: 'POST',
				body: JSON.stringify({
					content: Buffer.from(f.contents, 'utf8').toString('base64'),
					encoding: 'base64'
				})
			});
			return { path: f.path, sha: blob.sha };
		})
	);

	const newTree = await gh(`${repoPath}/git/trees`, {
		token,
		method: 'POST',
		body: JSON.stringify({
			base_tree: baseTreeSha,
			tree: blobs.map((b) => ({
				path: b.path,
				mode: '100644',
				type: 'blob',
				sha: b.sha
			}))
		})
	});

	const newCommit = await gh(`${repoPath}/git/commits`, {
		token,
		method: 'POST',
		body: JSON.stringify({
			message,
			tree: newTree.sha,
			parents: [parentSha]
		})
	});

	await gh(`${repoPath}/git/refs/heads/${branch}`, {
		token,
		method: 'PATCH',
		body: JSON.stringify({ sha: newCommit.sha, force: false })
	});

	return { ok: true, commitSha: newCommit.sha };
}
