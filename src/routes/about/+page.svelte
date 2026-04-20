<script>
	import SEO from '$lib/components/SEO.svelte';
	import content from '$lib/content.json';
	import projects from '$lib/projects.json';
	import { reveal } from '$lib/actions/reveal.js';

	let paragraphs = $derived(
		content.about
			.split('\n\n')
			.map((chunk) => chunk.trim())
			.filter(Boolean)
	);

	const featured = projects.slice(0, 6);
</script>

<SEO
	title="About — The Drawing Office"
	description="About The Drawing Office — architectural design studio in Browns Bay, Auckland."
	canonicalPath="/about"
	ogImage="/og/williams.jpg"
/>

<section class="about container">
	<div class="layout">
		<div class="body">
			<h1 class="page-title reveal" use:reveal>The Drawing Office</h1>

			{#if paragraphs.length === 0}
				<p class="placeholder reveal" use:reveal={{ delay: 100 }}>
					The Drawing Office is an architectural design studio based in Browns Bay, Auckland. More
					about the practice is on the way.
				</p>
			{:else}
				{#each paragraphs as paragraph, i}
					<p class="reveal" use:reveal={{ delay: 100 + i * 80 }}>{paragraph}</p>
				{/each}
			{/if}
		</div>

		<aside class="feature-grid" aria-label="Selected work">
			{#each featured as project, i (project.slug)}
				<a
					class="tile reveal"
					href="/{project.slug}"
					use:reveal={{ delay: 80 + i * 110 }}
				>
					<img
						src="/og/{project.slug}.jpg"
						alt="{project.title} — a home by The Drawing Office"
						loading="lazy"
						decoding="async"
					/>
					<span class="tile-title">{project.title}</span>
				</a>
			{/each}
		</aside>
	</div>
</section>

<style>
	.about {
		padding-block: var(--space-6) var(--space-6);
	}

	.page-title {
		font-size: var(--step-5);
		margin: 0 0 var(--space-3);
	}

	.layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-5);
		align-items: start;
	}

	@media (min-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: var(--space-6);
		}
	}

	.body {
		max-width: 65ch;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.body p {
		margin: 0;
		font-size: var(--step-1);
		line-height: 1.7;
		color: var(--fg);
	}

	.placeholder {
		color: var(--muted);
	}

	.feature-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
		margin: 0;
	}

	:global(.js-motion) .feature-grid .reveal:not(.is-visible) {
		transform: translateY(40px);
	}

	.tile {
		display: block;
		position: relative;
		overflow: hidden;
		background: #f2f2f2;
	}

	.tile img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		display: block;
		transition: transform 700ms var(--ease);
	}

	.tile:hover img {
		transform: scale(1.04);
	}

	.tile-title {
		position: absolute;
		left: 0.625rem;
		bottom: 0.5rem;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.7rem;
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
		opacity: 0;
		transform: translateY(4px);
		transition: opacity 220ms var(--ease), transform 220ms var(--ease);
	}

	.tile:hover .tile-title {
		opacity: 1;
		transform: translateY(0);
	}
</style>
