import { sanity, urlFor } from '$lib/sanity';
import { siteContentQuery, projectListQuery } from '$lib/queries';
import type { PageServerLoad } from './$types';

export const prerender = true;

type SanityImage = { asset?: unknown; alt?: string };
type FaqItem = { q?: string; a?: string };
type RawSiteContent = { faqIntro?: string; faqHero?: SanityImage; faq?: FaqItem[] } | null;
type RawProject = { slug: string; title: string; coverImage?: SanityImage };

const hasAsset = (img?: SanityImage): img is SanityImage => Boolean(img?.asset);

export const load: PageServerLoad = async () => {
	const [content, projectsRaw] = await Promise.all([
		sanity.fetch<RawSiteContent>(siteContentQuery),
		sanity.fetch<RawProject[]>(projectListQuery)
	]);

	const projects = projectsRaw ?? [];
	// Use the last project so the FAQ hero differs from the Process hero.
	const fallback = projects.length ? projects[projects.length - 1] : undefined;
	const source = hasAsset(content?.faqHero) ? content?.faqHero : fallback?.coverImage;
	const hero = hasAsset(source)
		? urlFor(source as never)
				.width(1600)
				.height(900)
				.fit('crop')
				.url()
		: null;
	const heroAlt = hasAsset(content?.faqHero)
		? (content?.faqHero?.alt ?? 'The Drawing Office — frequently asked questions')
		: fallback
			? `${fallback.title} — a home by The Drawing Office`
			: '';

	return {
		intro: content?.faqIntro ?? '',
		hero,
		heroAlt,
		items: (content?.faq ?? []).filter((item) => item?.q && item?.a)
	};
};
