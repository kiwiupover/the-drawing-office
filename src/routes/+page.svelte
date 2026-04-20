<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import projects from '$lib/projects.json';
	import content from '$lib/content.json';
	import { reveal } from '$lib/actions/reveal.js';
</script>

<SEO
	title="The Drawing Office — Architectural Design Studio, Auckland NZ"
	description="Architectural design studio in Browns Bay, Auckland. A selected portfolio of residential and commercial projects by The Drawing Office."
	canonicalPath="/"
/>

<h1 class="visually-hidden">The Drawing Office — Architectural Design, Auckland</h1>

<section class="hero">
	<div class="container hero-inner">
		<blockquote class="quote reveal" use:reveal>
			<p>
				&ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;<span class="attribution">&mdash; Steve Jobs</span>
			</p>
		</blockquote>
		{#if content.home.intro}
			<p class="studio-intro reveal" use:reveal={{ delay: 140 }}>{content.home.intro}</p>
		{/if}
	</div>
</section>

<section class="projects">
	<div class="container">
		<header class="section-head reveal" use:reveal>
			<span class="caps">Selected Projects</span>
		</header>

		{#if projects.length === 0}
			<p class="muted">No projects yet.</p>
		{:else}
			<div class="grid">
				{#each projects as project, i (project.slug)}
					<div class="reveal" use:reveal={{ delay: (i % 3) * 70 }}>
						<ProjectCard {project} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		padding: clamp(4rem, 12vh, 9rem) 0 clamp(3rem, 8vh, 6rem);
	}

	.hero-inner {
		max-width: 65ch;
	}

	.quote {
		margin: 0;
		text-align: left;
	}

	.quote p {
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(1.0625rem, 2.2vw, 1.625rem);
		line-height: 1.35;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		margin: 0;
		color: var(--fg);
	}

	.attribution {
		margin-left: 0.5rem;
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.7rem;
		color: var(--muted);
		white-space: nowrap;
	}

	.studio-intro {
		max-width: 65ch;
		margin: var(--space-5) 0 0;
		text-align: left;
		color: var(--muted);
		font-size: var(--step-1);
		line-height: 1.6;
	}

	.projects {
		padding-block: var(--space-5) var(--space-6);
	}

	.section-head {
		border-top: 1px solid var(--line);
		padding-top: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-4);
	}

	@media (min-width: 1100px) {
		.grid {
			gap: var(--space-5) var(--space-4);
		}
	}
</style>
