<script>
	import SEO from '$lib/components/SEO.svelte';
	import content from '$lib/content.json';

	let paragraphs = $derived(
		content.about
			.split('\n\n')
			.map((chunk) => chunk.trim())
			.filter(Boolean)
	);
</script>

<SEO
	title="About — The Drawing Office"
	description="About The Drawing Office — architectural design studio in Browns Bay, Auckland."
	canonicalPath="/about"
	ogImage="/og/williams.jpg"
/>

<section class="about container">
	<header class="intro">
		<h1>About</h1>
	</header>

	<div class="body">
		{#if paragraphs.length === 0}
			<p class="placeholder">
				The Drawing Office is an architectural design studio based in Browns Bay, Auckland. More
				about the practice is on the way.
			</p>
		{:else}
			{#each paragraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
		{/if}
	</div>
</section>

<style>
	.about {
		padding-block: var(--space-6) var(--space-6);
	}

	.intro {
		text-align: center;
		max-width: 640px;
		margin: 0 auto var(--space-5);
	}

	.intro h1 {
		font-size: var(--step-5);
	}

	.body {
		max-width: 640px;
		margin: 0 auto;
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
</style>
