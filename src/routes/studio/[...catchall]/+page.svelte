<script>
	import { onMount, onDestroy } from 'svelte';

	/** @type {HTMLDivElement | undefined} */
	let host = $state();
	/** @type {{ unmount: () => void } | null} */
	let root = null;

	onMount(async () => {
		if (!host) return;
		// @ts-ignore — react-dom types are not installed; loaded only client-side
		const { createRoot } = await import('react-dom/client');
		const React = await import('react');
		const { Studio } = await import('sanity');
		const configModule = await import('../../../../sanity.config');

		const config = configModule.default;
		const reactRoot = createRoot(host);
		reactRoot.render(React.createElement(Studio, { config }));
		root = { unmount: () => reactRoot.unmount() };
	});

	onDestroy(() => {
		root?.unmount();
	});
</script>

<svelte:head>
	<title>Studio — The Drawing Office</title>
	<meta name="robots" content="noindex,nofollow,noarchive" />
</svelte:head>

<div bind:this={host} class="studio-host"></div>

<style>
	.studio-host {
		position: fixed;
		inset: 0;
		background: #fff;
		z-index: 9999;
	}

	:global(body:has(.studio-host)) {
		overflow: hidden;
	}
</style>
