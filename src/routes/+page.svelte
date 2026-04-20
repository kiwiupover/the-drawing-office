<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import projects from '$lib/projects.json';
</script>

<svelte:head>
	<title>The Drawing Office</title>
	<meta
		name="description"
		content="The Drawing Office — architectural design studio based in Hobsonville, Auckland."
	/>
</svelte:head>

<section class="hero">
	<div class="container hero-inner">
		<blockquote class="quote">
			<p>
				&ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
			</p>
			<footer class="attribution">&mdash; Steve Jobs</footer>
		</blockquote>
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
		font-size: var(--step-6);
		line-height: 1.15;
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
