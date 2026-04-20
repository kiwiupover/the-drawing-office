<script>
	import '../app.css';
	import { SITE_URL, BUSINESS, DEFAULT_OG_IMAGE, absUrl } from '$lib/site.js';

	let { children } = $props();

	const businessLd = {
		'@context': 'https://schema.org',
		'@type': 'ArchitecturalService',
		'@id': `${SITE_URL}/#business`,
		name: BUSINESS.name,
		alternateName: 'The Drawing Office',
		url: SITE_URL,
		logo: absUrl('/favicon.svg'),
		image: {
			'@type': 'ImageObject',
			url: absUrl(DEFAULT_OG_IMAGE),
			width: 1200,
			height: 630
		},
		telephone: BUSINESS.telephone,
		email: BUSINESS.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: BUSINESS.streetAddress,
			addressLocality: BUSINESS.addressLocality,
			addressRegion: BUSINESS.addressRegion,
			addressCountry: BUSINESS.addressCountry
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: BUSINESS.geo.latitude,
			longitude: BUSINESS.geo.longitude
		},
		hasMap: `https://www.google.com/maps?q=${encodeURIComponent(
			`${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion}, ${BUSINESS.addressCountry}`
		)}`,
		areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
		knowsAbout: ['Residential architecture', 'New-build homes', 'Architectural design', 'House design'],
		sameAs: BUSINESS.sameAs
	};

	const websiteLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${SITE_URL}/#website`,
		url: SITE_URL,
		name: 'The Drawing Office',
		publisher: { '@id': `${SITE_URL}/#business` },
		inLanguage: 'en-NZ'
	};

	const jsonLd = [businessLd, websiteLd];
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap"
	/>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<div class="page">
	<header class="site-header">
		<div class="container header-inner">
			<a class="site-title" href="/">The Drawing Office</a>
			<nav class="site-nav" aria-label="Primary">
				<a href="/" class="nav-link">Projects</a>
				<a href="/about" class="nav-link">About</a>
				<a href="/contact" class="nav-link">Contact</a>
			</nav>
		</div>
	</header>

	<main class="site-main">
		{@render children?.()}
	</main>

	<footer class="site-footer">
		<div class="container footer-inner">
			<p class="footer-address">23 Sandiacre Way, Browns Bay, Auckland, New Zealand</p>
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
		white-space: nowrap;
	}

	.site-nav {
		display: flex;
		gap: clamp(1rem, 3vw, 2.25rem);
		flex-shrink: 0;
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
			min-height: 60px;
			gap: 0.75rem;
		}
		.site-title {
			font-size: 0.95rem;
		}
		.site-nav {
			gap: 0.875rem;
		}
		.nav-link {
			font-size: 0.6875rem;
			letter-spacing: 0.08em;
		}
	}
</style>
