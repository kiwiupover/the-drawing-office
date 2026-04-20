<script>
	import { reveal } from '$lib/actions/reveal.js';

	/** @type {{ images: string[], alt?: string }} */
	let { images, alt = '' } = $props();

	let activeIndex = $state(-1);
	let isOpen = $derived(activeIndex >= 0);
	let activeSrc = $derived(activeIndex >= 0 ? images[activeIndex] : '');

	function open(i) {
		activeIndex = i;
	}

	function close() {
		activeIndex = -1;
	}

	function prev() {
		if (activeIndex < 0) return;
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	function next() {
		if (activeIndex < 0) return;
		activeIndex = (activeIndex + 1) % images.length;
	}

	function onKey(e) {
		if (!isOpen) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowLeft') prev();
		else if (e.key === 'ArrowRight') next();
	}
</script>

<svelte:window onkeydown={onKey} />

<div class="gallery">
	{#each images as src, i (src + i)}
		<button
			type="button"
			class="tile reveal"
			class:wide={i % 5 === 0}
			onclick={() => open(i)}
			aria-label={`Open image ${i + 1}`}
			use:reveal
		>
			<img
				{src}
				alt={alt
					? `${alt} — The Drawing Office architectural project, photo ${i + 1} of ${images.length}`
					: `The Drawing Office architectural project, photo ${i + 1} of ${images.length}`}
				loading="lazy"
				decoding="async"
			/>
		</button>
	{/each}
</div>

{#if isOpen}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
		tabindex="-1"
		onclick={close}
		onkeydown={onKey}
	>
		<button class="lb-btn lb-close" type="button" onclick={close} aria-label="Close">&times;</button>
		<button
			class="lb-btn lb-prev"
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				prev();
			}}
			aria-label="Previous image">&larr;</button
		>
		<div
			class="lb-stage"
			role="presentation"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<img
				class="lb-img"
				src={activeSrc}
				alt={alt
					? `${alt} — The Drawing Office architectural project, photo ${activeIndex + 1} of ${images.length}`
					: `The Drawing Office architectural project, photo ${activeIndex + 1} of ${images.length}`}
			/>
		</div>
		<button
			class="lb-btn lb-next"
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				next();
			}}
			aria-label="Next image">&rarr;</button
		>
		<span class="lb-count">{activeIndex + 1} / {images.length}</span>
	</div>
{/if}

<style>
	.gallery {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-3);
	}

	@media (min-width: 720px) {
		.gallery {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-3);
		}
		.tile.wide {
			grid-column: 1 / -1;
		}
	}

	.tile {
		display: block;
		padding: 0;
		margin: 0;
		border: 0;
		background: #f2f2f2;
		cursor: zoom-in;
		overflow: hidden;
	}

	.tile img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 500ms var(--ease), opacity 400ms var(--ease);
	}

	.tile:hover img {
		transform: scale(1.02);
	}

	.lightbox {
		position: fixed;
		inset: 0;
		background: rgba(17, 17, 17, 0.94);
		display: grid;
		place-items: center;
		z-index: 100;
		padding: clamp(1rem, 4vw, 3rem);
	}

	.lb-stage {
		display: contents;
	}

	.lb-img {
		max-width: 95vw;
		max-height: 90vh;
		object-fit: contain;
		cursor: default;
	}

	.lb-btn {
		position: absolute;
		background: transparent;
		border: 0;
		color: #fff;
		font-size: 2rem;
		line-height: 1;
		padding: 0.75rem;
		cursor: pointer;
		opacity: 0.8;
		transition: opacity 180ms var(--ease);
	}

	.lb-btn:hover {
		opacity: 1;
	}

	.lb-close {
		top: 0.75rem;
		right: 1rem;
		font-size: 2.5rem;
	}
	.lb-prev {
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.lb-next {
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.lb-count {
		position: absolute;
		bottom: 1.25rem;
		left: 50%;
		transform: translateX(-50%);
		color: #fff;
		font-size: 0.75rem;
		letter-spacing: var(--track-caps);
		text-transform: uppercase;
		opacity: 0.7;
	}
</style>
