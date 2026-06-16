<script>
	import SEO from '$lib/components/SEO.svelte';
	import { reveal } from '$lib/actions/reveal.js';

	let { data } = $props();
	let stages = $derived(data.stages);
	let hero = $derived(data.hero);

	/** @param {number} n */
	const pad = (n) => String(n).padStart(2, '0');
</script>

<SEO
	title="Process — The Drawing Office, Architectural Designers"
	description="How a project runs, stage by stage: from brief and feasibility through concept, developed and detailed design, consent, builder selection, and construction observation."
	canonicalPath="/process"
/>

<section class="process container">
	<header class="intro">
		<h1 class="page-title reveal" use:reveal>Process</h1>
		{#if data.intro}
			<p class="lede reveal" use:reveal={{ delay: 100 }}>{data.intro}</p>
		{:else}
			<p class="lede placeholder reveal" use:reveal={{ delay: 100 }}>
				A clear path from first conversation to finished home. The stages will be outlined here
				soon.
			</p>
		{/if}
	</header>

	{#if hero}
		<figure class="hero reveal" use:reveal={{ delay: 120 }}>
			<img src={hero} alt={data.heroAlt} loading="eager" fetchpriority="high" decoding="async" />
		</figure>
	{/if}

	{#if stages.length > 0}
		<ol class="stages">
			{#each stages as stage, i (stage.name)}
				<li class="stage reveal" use:reveal={{ delay: 60 + i * 80 }}>
					<span class="stage-num" aria-hidden="true">{pad(i + 1)}</span>
					<div class="stage-body">
						<h2 class="stage-name">{stage.name}</h2>
						{#if stage.body}
							<p class="stage-text">{stage.body}</p>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	{/if}
</section>

<style>
	.process {
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

	.stages {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		max-width: 70ch;
	}

	.stage {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-3);
		align-items: baseline;
		border-top: 1px solid var(--line);
		padding-top: var(--space-4);
	}

	.stage-num {
		font-family: var(--font-serif);
		font-size: var(--step-4);
		line-height: 1;
		color: var(--muted);
	}

	.stage-name {
		font-family: var(--font-serif);
		font-size: var(--step-3);
		margin: 0 0 var(--space-2);
	}

	.stage-text {
		margin: 0;
		font-size: var(--step-0);
		line-height: 1.7;
		color: var(--fg);
	}
</style>
