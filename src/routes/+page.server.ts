import { sanity, urlFor } from '$lib/sanity';
import { projectListQuery, siteContentQuery } from '$lib/queries';
import type { PageServerLoad } from './$types';

export const prerender = true;

type RawProject = {
	slug: string;
	title: string;
	description?: string | null;
	coverImage?: unknown;
};

type RawSiteContent = { homeIntro?: string } | null;

export const load: PageServerLoad = async () => {
	const [projectsRaw, content] = await Promise.all([
		sanity.fetch<RawProject[]>(projectListQuery),
		sanity.fetch<RawSiteContent>(siteContentQuery)
	]);

	const projects = (projectsRaw ?? []).map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description ?? null,
		cover: p.coverImage
			? urlFor(p.coverImage as never).width(1200).height(800).fit('crop').url()
			: null
	}));

	return {
		projects,
		content: {
			homeIntro: content?.homeIntro ?? ''
		}
	};
};
