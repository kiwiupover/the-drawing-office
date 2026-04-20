<script>
	/** @typedef {{ slug: string, title: string, description: string | null, images: string[] }} Project */

	/** @type {{ project: Project }} */
	let { project } = $props();

	let cover = $derived(project.images?.[0] ?? '/images/placeholder.jpg');
</script>

<a class="card" href="/{project.slug}">
	<div class="frame">
		<img src={cover} alt={project.title} loading="lazy" decoding="async" />
	</div>
	<div class="meta">
		<span class="title">{project.title}</span>
		<span class="arrow" aria-hidden="true">&rarr;</span>
	</div>
</a>

<style>
	.card {
		display: block;
		color: inherit;
	}

	.frame {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background: #f2f2f2;
	}

	.frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 700ms var(--ease);
	}

	.card:hover .frame img {
		transform: scale(1.04);
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: var(--space-2);
		padding-right: 0.25rem;
	}

	.title {
		text-transform: uppercase;
		letter-spacing: var(--track-caps);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.arrow {
		color: var(--muted);
		font-size: 0.9rem;
		transition: transform 220ms var(--ease), color 220ms var(--ease);
	}

	.card:hover .arrow {
		color: var(--fg);
		transform: translateX(4px);
	}
</style>
