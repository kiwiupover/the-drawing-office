<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let submitting = $state(false);

	const DRAFT_KEY = 'drawing-office-studio-draft-v2';

	let projectDrafts = $state(
		Object.fromEntries((data.projects ?? []).map((p) => [p.slug, p.description]))
	);
	let homeIntro = $state(data.content?.home?.intro ?? '');
	let aboutText = $state(data.content?.about ?? '');
	let contactIntro = $state(data.content?.contact?.intro ?? '');

	function serverBaseline() {
		return JSON.stringify({
			projects: Object.fromEntries(
				(data.projects ?? []).map((p) => [p.slug, p.description])
			),
			content: data.content ?? null
		});
	}

	$effect(() => {
		if (!data.authenticated) return;
		try {
			const raw = localStorage.getItem(DRAFT_KEY);
			if (!raw) return;
			const draft = JSON.parse(raw);
			if (draft.baseline !== serverBaseline()) {
				localStorage.removeItem(DRAFT_KEY);
				return;
			}
			if (draft.projects && typeof draft.projects === 'object') {
				projectDrafts = { ...projectDrafts, ...draft.projects };
			}
			if (typeof draft.homeIntro === 'string') homeIntro = draft.homeIntro;
			if (typeof draft.about === 'string') aboutText = draft.about;
			if (typeof draft.contactIntro === 'string') contactIntro = draft.contactIntro;
		} catch {
			// ignore corrupt drafts
		}
	});

	$effect(() => {
		if (!data.authenticated) return;
		const payload = {
			baseline: serverBaseline(),
			projects: projectDrafts,
			homeIntro,
			about: aboutText,
			contactIntro
		};
		try {
			localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
		} catch {
			// storage full or unavailable — nothing we can do
		}
	});

	function clearDraft() {
		try {
			localStorage.removeItem(DRAFT_KEY);
		} catch {
			// ignore
		}
	}
</script>

<svelte:head>
	<title>Studio</title>
	<meta name="robots" content="noindex,nofollow,noarchive" />
</svelte:head>

<section class="studio container">
	{#if !data.authenticated}
		<div class="login">
			<h1>Studio</h1>
			<p class="hint">Sign in to edit site content.</p>

			{#if form?.error === 'invalid_credentials'}
				<p class="alert error" role="alert">Invalid credentials.</p>
			{:else if form?.error === 'rate_limited'}
				<p class="alert error" role="alert">Too many attempts. Try again later.</p>
			{/if}

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<label class="field">
					<span class="label">Password</span>
					<input type="password" name="password" required autocomplete="current-password" />
				</label>

				<div class="honeypot" aria-hidden="true">
					<label>
						Company
						<input type="text" name="company" tabindex="-1" autocomplete="off" />
					</label>
				</div>

				<button class="submit" type="submit" disabled={submitting}>
					{submitting ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</div>
	{:else}
		<header class="editor-head">
			<h1>Studio</h1>
			<form
				method="POST"
				action="?/logout"
				use:enhance={() => {
					return async ({ update }) => {
						clearDraft();
						await update();
					};
				}}
			>
				<button type="submit" class="text-btn">Sign out</button>
			</form>
		</header>

		{#if form?.ok}
			<p class="alert success" role="status">
				{#if form.unchanged}
					No changes to publish.
				{:else}
					Published. Commit <code>{form.commitSha?.slice(0, 7)}</code>.
				{/if}
			</p>
		{:else if form?.error === 'publish_failed'}
			<p class="alert error" role="alert">Publish failed. Check the server logs.</p>
		{:else if form?.error === 'rate_limited'}
			<p class="alert error" role="alert">Rate-limited. Slow down.</p>
		{:else if form?.error === 'unauthorized'}
			<p class="alert error" role="alert">Session expired. Sign in again.</p>
		{/if}

		<form
			method="POST"
			action="?/publish"
			use:enhance={() => {
				submitting = true;
				return async ({ update, result }) => {
					await update();
					if (result.type === 'success' && result.data?.ok && !result.data?.unchanged) {
						clearDraft();
					}
					submitting = false;
				};
			}}
		>
			<fieldset class="group">
				<legend>Site copy</legend>

				<label class="field">
					<span class="label">Homepage intro</span>
					<span class="hint"
						>1–3 sentences shown on the homepage under the Steve Jobs quote. Speak to someone
						planning a new home.</span
					>
					<textarea
						name="home.intro"
						rows="4"
						placeholder="The Drawing Office designs new homes across Auckland — thoughtful architecture shaped by your site, your brief, and the way you want to live."
						bind:value={homeIntro}
					></textarea>
				</label>

				<label class="field">
					<span class="label">About</span>
					<span class="hint"
						>Full text of the /about page. Separate paragraphs with a blank line. Help people
						thinking about building understand how you work.</span
					>
					<textarea
						name="about"
						rows="8"
						placeholder={`The Drawing Office is an Auckland architecture practice designing new homes for people building once, and building well.

We start every project by listening — to your site, your brief, and the way you actually want to live. From concept through consent to construction, we stay involved, keeping the drawings in step with what's happening on site.

Based in Browns Bay, we work with clients across Auckland and the wider region.`}
						bind:value={aboutText}
					></textarea>
				</label>

				<label class="field">
					<span class="label">Contact intro</span>
					<span class="hint"
						>One line at the top of the /contact page. Invite prospective clients to reach out.</span
					>
					<textarea
						name="contact.intro"
						rows="3"
						placeholder="Planning a new home? Tell us about your site and what you have in mind — we'll be in touch to talk it through."
						bind:value={contactIntro}
					></textarea>
				</label>
			</fieldset>

			<fieldset class="group">
				<legend>Projects</legend>
				<p class="hint group-hint">
					1–2 sentences per project. Name the type of home, the site or suburb, the materials,
					and the key idea of the brief. Shown on each project page and used by search engines
					to help people in New Zealand find your work.
				</p>

				{#each data.projects ?? [] as project (project.slug)}
					<label class="field">
						<span class="label">{project.title} <span class="slug">/{project.slug}</span></span>
						<textarea
							name="project:{project.slug}"
							rows="4"
							placeholder="e.g. A four-bedroom family home on a north-facing coastal section in Hobsonville. Designed around a central courtyard for shelter and sun, clad in cedar and dark-stained ply."
							bind:value={projectDrafts[project.slug]}
						></textarea>
					</label>
				{/each}
			</fieldset>

			<div class="actions">
				<button class="submit" type="submit" disabled={submitting}>
					{submitting ? 'Publishing…' : 'Publish'}
				</button>
				<p class="hint">Saves a single commit to the deploy branch. Vercel rebuilds in ~60s.</p>
			</div>
		</form>
	{/if}
</section>

<style>
	.studio {
		padding-block: var(--space-5) var(--space-6);
		max-width: 760px;
	}

	h1 {
		font-size: var(--step-4);
		margin: 0;
	}

	.login {
		max-width: 360px;
		margin: var(--space-5) auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.editor-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: var(--space-4);
	}

	.group {
		border: 1px solid var(--line);
		padding: var(--space-3);
		margin: 0 0 var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.group legend {
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.7rem;
		color: var(--muted);
		padding: 0 0.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field .label {
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.7rem;
		color: var(--muted);
	}

	.slug {
		text-transform: none;
		letter-spacing: 0;
		color: var(--muted);
		margin-left: 0.5rem;
		font-size: 0.75rem;
	}

	textarea,
	input[type='password'] {
		font: inherit;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--line);
		background: var(--bg);
		color: var(--fg);
		font-family: var(--font-sans);
	}

	textarea {
		resize: vertical;
		min-height: 5rem;
	}

	textarea:focus,
	input[type='password']:focus {
		outline: none;
		border-color: var(--fg);
	}

	.honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.submit {
		align-self: flex-start;
		background: var(--fg);
		color: var(--bg);
		border: 1px solid var(--fg);
		padding: 0.75rem 1.5rem;
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 180ms var(--ease), color 180ms var(--ease);
	}

	.submit:hover:not(:disabled) {
		background: transparent;
		color: var(--fg);
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.text-btn {
		background: none;
		border: 0;
		padding: 0;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.7rem;
		cursor: pointer;
	}

	.text-btn:hover {
		color: var(--fg);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.hint {
		color: var(--muted);
		font-size: 0.8125rem;
		margin: 0;
	}

	.alert {
		padding: 0.75rem 1rem;
		border: 1px solid var(--line);
		font-size: 0.9rem;
		margin: 0 0 var(--space-3);
	}

	.alert.success {
		border-color: #0a7a3b;
		color: #0a7a3b;
	}

	.alert.error {
		border-color: #b00020;
		color: #b00020;
	}

	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.85em;
	}
</style>
