import { fail, redirect } from '@sveltejs/kit';
import projects from '$lib/projects.json';
import content from '$lib/content.json';
import { checkRateLimit } from '$lib/server/ratelimit';
import {
	SESSION_COOKIE,
	createSessionToken,
	verifyPassword,
	verifySessionToken
} from '$lib/server/admin-auth';
import { commitFiles } from '$lib/server/github';

export const prerender = false;

const NOINDEX_HEADERS = { 'X-Robots-Tag': 'noindex,nofollow,noarchive' };

/**
 * @param {import('./$types').PageServerLoadEvent} event
 */
export async function load({ cookies, setHeaders }) {
	setHeaders(NOINDEX_HEADERS);
	const token = cookies.get(SESSION_COOKIE);
	if (!verifySessionToken(token)) {
		return { authenticated: false };
	}
	return {
		authenticated: true,
		projects: projects.map((p) => ({
			slug: p.slug,
			title: p.title,
			description: p.description ?? ''
		})),
		content: {
			home: { intro: content.home?.intro ?? '' },
			about: content.about ?? '',
			contact: { intro: content.contact?.intro ?? '' }
		}
	};
}

function cookieOptions(expires) {
	return {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: /** @type {const} */ ('lax'),
		expires
	};
}

export const actions = {
	login: async ({ request, cookies, getClientAddress, setHeaders }) => {
		setHeaders(NOINDEX_HEADERS);
		const ip = getClientAddress();
		if (!checkRateLimit(`login:${ip}`)) return fail(429, { error: 'rate_limited' });

		const data = await request.formData();
		const password = String(data.get('password') ?? '');
		const honeypot = String(data.get('company') ?? '');

		if (honeypot) return { success: true };

		if (!verifyPassword(password)) {
			return fail(401, { error: 'invalid_credentials' });
		}

		const { token, expiresAt } = createSessionToken();
		cookies.set(SESSION_COOKIE, token, cookieOptions(expiresAt));
		throw redirect(303, '/studio');
	},

	logout: async ({ cookies, setHeaders }) => {
		setHeaders(NOINDEX_HEADERS);
		cookies.delete(SESSION_COOKIE, { path: '/' });
		throw redirect(303, '/studio');
	},

	publish: async ({ request, cookies, getClientAddress, setHeaders }) => {
		setHeaders(NOINDEX_HEADERS);
		const token = cookies.get(SESSION_COOKIE);
		if (!verifySessionToken(token)) return fail(401, { error: 'unauthorized' });

		const ip = getClientAddress();
		if (!checkRateLimit(`publish:${ip}`)) return fail(429, { error: 'rate_limited' });

		const data = await request.formData();

		const nextProjects = projects.map((p) => {
			const raw = data.get(`project:${p.slug}`);
			if (raw === null) return p;
			const value = String(raw).trim();
			return { ...p, description: value.length ? value : null };
		});

		const nextContent = {
			home: { intro: String(data.get('home.intro') ?? '').trim() },
			about: String(data.get('about') ?? '').trim(),
			contact: { intro: String(data.get('contact.intro') ?? '').trim() }
		};

		const projectsChanged = JSON.stringify(nextProjects) !== JSON.stringify(projects);
		const contentChanged = JSON.stringify(nextContent) !== JSON.stringify(content);

		if (!projectsChanged && !contentChanged) {
			return { ok: true, commitSha: null, unchanged: true };
		}

		/** @type {Array<{ path: string; contents: string }>} */
		const files = [];
		if (projectsChanged) {
			files.push({
				path: 'src/lib/projects.json',
				contents: JSON.stringify(nextProjects, null, 2) + '\n'
			});
		}
		if (contentChanged) {
			files.push({
				path: 'src/lib/content.json',
				contents: JSON.stringify(nextContent, null, 2) + '\n'
			});
		}

		try {
			const result = await commitFiles({
				files,
				message: 'Studio: update site content'
			});
			return { ok: true, commitSha: result.commitSha };
		} catch (e) {
			console.error('studio publish failed', e);
			return fail(502, { error: 'publish_failed' });
		}
	}
};
