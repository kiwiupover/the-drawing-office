import { sanity, urlFor } from '$lib/sanity';
import { siteContentQuery, projectListQuery } from '$lib/queries';
import type { PageServerLoad } from './$types';

export const prerender = true;

type SanityImage = { asset?: unknown; alt?: string };
type ProcessStage = { name?: string; body?: string };
type RawSiteContent = {
	processIntro?: string;
	processHero?: SanityImage;
	process?: ProcessStage[];
	services?: Array<{ title?: string }>;
} | null;
type RawProject = { slug: string; title: string; coverImage?: SanityImage };

const hasAsset = (img?: SanityImage): img is SanityImage => Boolean(img?.asset);

export const load: PageServerLoad = async () => {
	const [content, projectsRaw] = await Promise.all([
		sanity.fetch<RawSiteContent>(siteContentQuery),
		sanity.fetch<RawProject[]>(projectListQuery)
	]);

	const projects = projectsRaw ?? [];
	// Offset past the projects the Services page uses for its per-service fallbacks,
	// so the Process hero doesn't repeat one of those photos.
	const servicesCount = (content?.services ?? []).filter((s) => s?.title).length;
	const fallback = projects.length ? projects[servicesCount % projects.length] : undefined;
	const source = hasAsset(content?.processHero) ? content?.processHero : fallback?.coverImage;
	const hero = hasAsset(source)
		? urlFor(source as never)
				.width(1600)
				.height(900)
				.fit('crop')
				.url()
		: null;
	const heroAlt = hasAsset(content?.processHero)
		? (content?.processHero?.alt ?? 'The Drawing Office — our design process')
		: fallback
			? `${fallback.title} — a home by The Drawing Office`
			: '';

	return {
		intro: content?.processIntro ?? '',
		hero,
		heroAlt,
		stages: (content?.process ?? []).filter((s) => s?.name)
	};
};
