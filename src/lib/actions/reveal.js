/**
 * Adds `.is-visible` to the element the first time it intersects the viewport.
 *
 * Works alongside the `.reveal` class and the `.js-motion` flag on <html>:
 * - No JS or reduced-motion → elements are always visible (no styling applied).
 * - With JS → `.js-motion .reveal` is hidden until `.is-visible` is added here.
 *
 * @param {HTMLElement} node
 * @param {{ delay?: number; threshold?: number; rootMargin?: string }} [options]
 */
export function reveal(node, options = {}) {
	const { delay = 0, threshold = 0.08, rootMargin = '0px 0px -5% 0px' } = options;

	if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
		node.classList.add('is-visible');
		return;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-visible');
		return;
	}

	if (delay) node.style.transitionDelay = `${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold, rootMargin }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
