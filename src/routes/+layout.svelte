<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap"
	/>
</svelte:head>

<div class="page">
	<header class="site-header">
		<div class="container header-inner">
			<a class="site-title" href="/">The Drawing Office</a>
			<nav class="site-nav" aria-label="Primary">
				<a href="/" class="nav-link">Projects</a>
				<a href="/contact" class="nav-link">Contact</a>
			</nav>
		</div>
	</header>

	<main class="site-main">
		{@render children?.()}
	</main>

	<footer class="site-footer">
		<div class="container footer-inner">
			<p class="footer-address">1/111 Hobsonville Rd, Hobsonville, Auckland</p>
			<p class="footer-copy">&copy; 2026 The Drawing Office Ltd</p>
		</div>
	</footer>
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--bg) 92%, transparent);
		backdrop-filter: saturate(180%) blur(8px);
		border-bottom: 1px solid var(--line);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 72px;
		gap: var(--space-3);
	}

	.site-title {
		font-family: var(--font-serif);
		font-size: 1.375rem;
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.site-nav {
		display: flex;
		gap: clamp(1rem, 3vw, 2.25rem);
	}

	.nav-link {
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0;
		position: relative;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 1px;
		background: var(--fg);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 220ms var(--ease);
	}

	.nav-link:hover::after {
		transform: scaleX(1);
	}

	.site-main {
		flex: 1;
	}

	.site-footer {
		border-top: 1px solid var(--line);
		margin-top: var(--space-7);
		padding: var(--space-4) 0;
	}

	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.footer-address,
	.footer-copy {
		margin: 0;
		color: var(--muted);
		font-size: 0.8125rem;
		letter-spacing: 0.02em;
	}

	@media (max-width: 520px) {
		.header-inner {
			min-height: 64px;
		}
		.site-title {
			font-size: 1.125rem;
		}
	}
</style>
