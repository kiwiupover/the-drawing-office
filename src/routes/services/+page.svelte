<script>
	import SEO from '$lib/components/SEO.svelte';
	import { reveal } from '$lib/actions/reveal.js';

	let { data } = $props();
	let services = $derived(data.services);
</script>

<SEO
	title="Services — The Drawing Office, Architectural Designers"
	description="New homes, renovations and alterations, subdivisions and multi-unit, and resource and building consents — residential architectural design for Auckland and across New Zealand."
	canonicalPath="/services"
/>

<section class="services container">
	<header class="intro">
		<h1 class="page-title reveal" use:reveal>Services</h1>
		{#if data.intro}
			<p class="lede reveal" use:reveal={{ delay: 100 }}>{data.intro}</p>
		{:else}
			<p class="lede placeholder reveal" use:reveal={{ delay: 100 }}>
				From new homes to renovations, subdivisions, and consents — the full design service,
				described here soon.
			</p>
		{/if}
	</header>

	{#if services.length > 0}
		<div class="rows">
			{#each services as service, i (service.title)}
				<article class="row reveal" use:reveal={{ delay: 60 }}>
					{#if service.image}
						<figure class="media">
							<img src={service.image} alt={service.imageAlt} loading="lazy" decoding="async" />
						</figure>
					{/if}
					<div class="text">
						<span class="row-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<h2 class="row-title">{service.title}</h2>
						{#if service.body}
							<p class="row-body">{service.body}</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	.services {
		padding-block: var(--space-6) var(--space-6);
	}

	.page-title {
		font-size: var(--step-5);
		margin: 0 0 var(--space-3);
	}

	.intro {
		max-width: 65ch;
		margin: 0 0 var(--space-6);
	}

	.lede {
		margin: 0;
		font-size: var(--step-1);
		line-height: 1.7;
		color: var(--fg);
	}

	.placeholder {
		color: var(--muted);
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-3);
		align-items: center;
	}

	.media {
		margin: 0;
		overflow: hidden;
		background: #f2f2f2;
	}

	.media img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
		transition: transform 700ms var(--ease);
	}

	.row:hover .media img {
		transform: scale(1.03);
	}

	.text {
		max-width: 52ch;
	}

	.row-index {
		display: block;
		font-family: var(--font-serif);
		font-size: var(--step-1);
		color: var(--muted);
		margin-bottom: var(--space-1);
	}

	.row-title {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		margin: 0 0 var(--space-2);
	}

	.row-body {
		margin: 0;
		font-size: var(--step-0);
		line-height: 1.7;
		color: var(--fg);
	}

	@media (min-width: 800px) {
		.row {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
			gap: var(--space-6);
		}

		/* Alternate the photo side for an editorial rhythm. */
		.row:nth-child(even) .media {
			order: 2;
		}
	}
</style>
