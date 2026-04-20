import { error } from '@sveltejs/kit';
import projects from '$lib/projects.json';

export const prerender = true;

export function entries() {
	return projects.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const idx = projects.findIndex((p) => p.slug === params.slug);
	if (idx === -1) throw error(404, 'Project not found');

	const project = projects[idx];
	const prev = projects[(idx - 1 + projects.length) % projects.length];
	const next = projects[(idx + 1) % projects.length];

	return { project, prev, next };
}
