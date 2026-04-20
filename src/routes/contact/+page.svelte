<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Contact — The Drawing Office</title>
	<meta name="description" content="Get in touch with The Drawing Office in Browns Bay, Auckland." />
</svelte:head>

<section class="contact container">
	<header class="intro">
		<h1>Contact</h1>
		<p class="lede">We would love to hear about your project. Drop us a line.</p>
	</header>

	<div class="grid">
		<div class="info">
			<address>
				<p class="studio-name">The Drawing Office Ltd</p>
				<p class="address-line">21 Sandiache Way,<br />Browns Bay, Auckland,<br />New Zealand</p>
				<p class="line">
					<span class="label">Phone</span>
					<a href="tel:+6499709515">09 970 9515</a>
				</p>
				<p class="line">
					<span class="label">Email</span>
					<a href="mailto:info@thedrawingoffice.com">info@thedrawingoffice.com</a>
				</p>
			</address>

			<div class="map">
				<iframe
					title="Map to The Drawing Office"
					src="https://www.google.com/maps?q=21+Sandiache+Way,+Browns+Bay,+Auckland,+New+Zealand&output=embed"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>

		<form
			class="form"
			method="POST"
			action="?/send"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			{#if form?.success}
				<p class="alert success" role="status">
					Thanks — your message is through. We&rsquo;ll be in touch shortly.
				</p>
			{:else if form?.error}
				<p class="alert error" role="alert">{form.error}</p>
			{/if}

			<label class="field">
				<span class="label">Name</span>
				<input type="text" name="name" required autocomplete="name" value={form?.values?.name ?? ''} />
			</label>

			<label class="field">
				<span class="label">Email</span>
				<input
					type="email"
					name="email"
					required
					autocomplete="email"
					value={form?.values?.email ?? ''}
				/>
			</label>

			<label class="field">
				<span class="label">Message</span>
				<textarea name="message" rows="6" required>{form?.values?.message ?? ''}</textarea>
			</label>

			<div class="honeypot" aria-hidden="true">
				<label>
					Company
					<input type="text" name="company" tabindex="-1" autocomplete="off" />
				</label>
			</div>

			<button class="submit" type="submit" disabled={submitting}>
				{submitting ? 'Sending…' : 'Send message'}
			</button>
		</form>
	</div>
</section>

<style>
	.contact {
		padding-block: var(--space-6) var(--space-6);
	}

	.intro {
		text-align: center;
		max-width: 640px;
		margin: 0 auto var(--space-5);
	}

	.intro h1 {
		font-size: var(--step-5);
	}

	.lede {
		margin-top: var(--space-2);
		color: var(--muted);
		font-size: var(--step-1);
	}

	.grid {
		display: grid;
		gap: var(--space-5);
		grid-template-columns: 1fr;
	}

	@media (min-width: 900px) {
		.grid {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-6);
		}
	}

	address {
		font-style: normal;
	}

	.studio-name {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		margin: 0 0 var(--space-1);
	}

	.address-line {
		margin: 0 0 var(--space-3);
		color: var(--muted);
	}

	.line {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
		margin: 0 0 0.5rem;
		border-top: 1px solid var(--line);
		padding-top: 0.75rem;
	}

	.line .label {
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.7rem;
		color: var(--muted);
		min-width: 4rem;
	}

	.line a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.map {
		margin-top: var(--space-4);
		border: 1px solid var(--line);
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}

	.map iframe {
		width: 100%;
		height: 100%;
		border: 0;
		display: block;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
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

	textarea {
		resize: vertical;
		min-height: 10rem;
		font-family: var(--font-sans);
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
		padding: 0.875rem 1.75rem;
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

	.alert {
		padding: 0.875rem 1rem;
		border: 1px solid var(--line);
		font-size: 0.9rem;
	}

	.alert.success {
		border-color: #0a7a3b;
		color: #0a7a3b;
	}

	.alert.error {
		border-color: #b00020;
		color: #b00020;
	}
</style>
