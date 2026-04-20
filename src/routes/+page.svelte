<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import projects from '$lib/projects.json';
	import content from '$lib/content.json';
</script>

<SEO
	title="The Drawing Office — Architectural Design Studio, Auckland NZ"
	description="Architectural design studio in Browns Bay, Auckland. A selected portfolio of residential and commercial projects by The Drawing Office."
	canonicalPath="/"
/>

<h1 class="visually-hidden">The Drawing Office — Architectural Design, Auckland</h1>

<section class="hero">
	<div class="container hero-inner">
		<blockquote class="quote">
			<p>
				&ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
			</p>
			<footer class="attribution">&mdash; Steve Jobs</footer>
		</blockquote>
		{#if content.home.intro}
			<p class="studio-intro">{content.home.intro}</p>
		{/if}
	</div>
</section>

<section class="projects">
	<div class="container">
		<header class="section-head">
			<span class="caps">Selected Projects</span>
		</header>

		{#if projects.length === 0}
			<p class="muted">No projects yet.</p>
		{:else}
			<div class="grid">
				{#each projects as project (project.slug)}
					<ProjectCard {project} />
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
		max-width: 960px;
	}

	.quote {
		margin: 0;
		text-align: center;
	}

	.quote p {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-size: clamp(1.75rem, 4vw, 3.25rem);
		line-height: 1.2;
		letter-spacing: -0.01em;
		margin: 0;
		color: var(--fg);
	}

	.attribution {
		margin-top: var(--space-4);
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.75rem;
		color: var(--muted);
	}

	.studio-intro {
		max-width: 640px;
		margin: var(--space-5) auto 0;
		text-align: center;
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
