<script>
	import SEO from '$lib/components/SEO.svelte';
	import { reveal } from '$lib/actions/reveal.js';

	let { data } = $props();
	let items = $derived(data.items);
	let hero = $derived(data.hero);

	let faqLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.q ?? '',
			acceptedAnswer: { '@type': 'Answer', text: item.a ?? '' }
		}))
	});
</script>

<SEO
	title="FAQ — The Drawing Office, Architectural Designers"
	description="Answers to common questions about working with an architectural designer: cost, timelines, resource and building consents, and the difference between a designer and an architect."
	canonicalPath="/faq"
/>

<svelte:head>
	{#if items.length > 0}
		{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
	{/if}
</svelte:head>

<section class="faq container">
	<header class="intro">
		<h1 class="page-title reveal" use:reveal>Frequently asked questions</h1>
		{#if data.intro}
			<p class="lede reveal" use:reveal={{ delay: 100 }}>{data.intro}</p>
		{:else}
			<p class="lede placeholder reveal" use:reveal={{ delay: 100 }}>
				Cost, timelines, consents, and what working with us involves — answered here soon.
			</p>
		{/if}
	</header>

	{#if hero}
		<figure class="hero reveal" use:reveal={{ delay: 120 }}>
			<img src={hero} alt={data.heroAlt} loading="eager" fetchpriority="high" decoding="async" />
		</figure>
	{/if}

	{#if items.length > 0}
		<div class="list">
			{#each items as item, i (item.q)}
				<details class="qa reveal" use:reveal={{ delay: 50 + i * 60 }}>
					<summary class="question">{item.q}</summary>
					<p class="answer">{item.a}</p>
				</details>
			{/each}
		</div>
	{/if}
</section>

<style>
	.faq {
		padding-block: var(--space-6) var(--space-6);
	}

	.page-title {
		font-size: var(--step-5);
		margin: 0 0 var(--space-3);
	}

	.intro {
		max-width: 65ch;
		margin: 0 0 var(--space-5);
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

	.hero {
		margin: 0 0 var(--space-6);
		overflow: hidden;
		background: #f2f2f2;
	}

	.hero img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		display: block;
	}

	.list {
		max-width: 70ch;
	}

	.qa {
		border-top: 1px solid var(--line);
		padding: var(--space-3) 0;
	}

	.qa:last-child {
		border-bottom: 1px solid var(--line);
	}

	.question {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		cursor: pointer;
		list-style: none;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.question::-webkit-details-marker {
		display: none;
	}

	.question::after {
		content: '+';
		color: var(--muted);
		font-size: var(--step-2);
		line-height: 1;
		transition: transform 220ms var(--ease);
	}

	.qa[open] .question::after {
		content: '\2212';
	}

	.answer {
		margin: var(--space-2) 0 0;
		max-width: 60ch;
		font-size: var(--step-0);
		line-height: 1.7;
		color: var(--fg);
	}
</style>
