import { sanity, urlFor } from '$lib/sanity';
import { projectListQuery, siteContentQuery } from '$lib/queries';
import { safeTerminology } from '$lib/safe-terms.js';
import type { PageServerLoad } from './$types';

export const prerender = true;

type RawProject = { slug: string; title: string; coverImage?: unknown };
type RawSiteContent = { about?: string } | null;

export const load: PageServerLoad = async () => {
	const [projectsRaw, content] = await Promise.all([
		sanity.fetch<RawProject[]>(projectListQuery),
		sanity.fetch<RawSiteContent>(siteContentQuery)
	]);

	const featured = (projectsRaw ?? []).slice(0, 6).map((p) => ({
		slug: p.slug,
		title: p.title,
		cover: p.coverImage
			? urlFor(p.coverImage as never).width(900).height(600).fit('crop').url()
			: null
	}));

	return {
		about: safeTerminology(content?.about) ?? '',
		featured
	};
};
