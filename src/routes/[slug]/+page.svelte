<script>
	import Gallery from '$lib/components/Gallery.svelte';

	let { data } = $props();
	let project = $derived(data.project);
	let prev = $derived(data.prev);
	let next = $derived(data.next);
</script>

<svelte:head>
	<title>{project.title} — The Drawing Office</title>
	{#if project.description}
		<meta name="description" content={project.description} />
	{/if}
</svelte:head>

<article class="project">
	<header class="project-head container">
		<h1>{project.title}</h1>
		{#if project.description}
			<p class="desc">{project.description}</p>
		{/if}
	</header>

	<div class="container">
		<Gallery images={project.images} alt={project.title} />
	</div>

	<nav class="pager container" aria-label="Project navigation">
		<a class="pager-link prev" href="/{prev.slug}">
			<span class="pager-direction">&larr; Previous</span>
			<span class="pager-title">{prev.title}</span>
		</a>
		<a class="pager-link next" href="/{next.slug}">
			<span class="pager-direction">Next &rarr;</span>
			<span class="pager-title">{next.title}</span>
		</a>
	</nav>
</article>

<style>
	.project {
		padding-bottom: var(--space-6);
	}

	.project-head {
		text-align: center;
		padding-block: var(--space-6) var(--space-4);
		max-width: 760px;
	}

	.project-head h1 {
		font-size: var(--step-5);
		letter-spacing: -0.02em;
	}

	.desc {
		margin-top: var(--space-2);
		color: var(--muted);
		font-size: var(--step-1);
		line-height: 1.6;
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		margin-top: var(--space-6);
		padding-top: var(--space-3);
		border-top: 1px solid var(--line);
	}

	.pager-link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: 48%;
	}

	.pager-link.next {
		text-align: right;
		align-items: flex-end;
	}

	.pager-direction {
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.75rem;
		color: var(--muted);
	}

	.pager-title {
		font-family: var(--font-serif);
		font-size: var(--step-2);
		transition: opacity 180ms var(--ease);
	}

	.pager-link:hover .pager-title {
		opacity: 0.6;
	}
</style>
