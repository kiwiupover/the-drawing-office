<script>
	import { page } from '$app/state';
	import { SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, absUrl } from '$lib/site.js';

	/** @type {{ title: string, description?: string, canonicalPath?: string, ogImage?: string, ogImageAlt?: string, ogType?: string }} */
	let {
		title,
		description = SITE_DESCRIPTION,
		canonicalPath,
		ogImage = DEFAULT_OG_IMAGE,
		ogImageAlt,
		ogType = 'website'
	} = $props();

	let path = $derived(canonicalPath ?? page.url.pathname);
	let canonical = $derived(absUrl(path));
	let image = $derived(absUrl(ogImage));
	let imageAlt = $derived(
		ogImageAlt ?? (title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`)
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:image" content={image} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:locale" content="en_NZ" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
