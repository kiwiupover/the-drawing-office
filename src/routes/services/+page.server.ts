import { sanity, urlFor } from '$lib/sanity';
import { siteContentQuery, projectListQuery } from '$lib/queries';
import type { PageServerLoad } from './$types';

export const prerender = true;

type SanityImage = { asset?: unknown; alt?: string };
type ServiceItem = { title?: string; body?: string; image?: SanityImage };
type RawSiteContent = { servicesIntro?: string; services?: ServiceItem[] } | null;
type RawProject = { slug: string; title: string; coverImage?: SanityImage };

const hasAsset = (img?: SanityImage): img is SanityImage => Boolean(img?.asset);

export const load: PageServerLoad = async () => {
	const [content, projectsRaw] = await Promise.all([
		sanity.fetch<RawSiteContent>(siteContentQuery),
		sanity.fetch<RawProject[]>(projectListQuery)
	]);

	const projects = projectsRaw ?? [];

	const services = (content?.services ?? [])
		.filter((s) => s?.title)
		.map((s, i) => {
			// A different project per service so the page never repeats one photo.
			const fallback = projects.length ? projects[i % projects.length] : undefined;
			const source = hasAsset(s.image) ? s.image : fallback?.coverImage;
			const image = hasAsset(source)
				? urlFor(source as never).width(1000).height(750).fit('crop').url()
				: null;
			const imageAlt = hasAsset(s.image)
				? (s.image?.alt ?? `${s.title} — The Drawing Office`)
				: fallback
					? `${fallback.title} — a home by The Drawing Office`
					: '';

			return { title: s.title, body: s.body ?? '', image, imageAlt };
		});

	return {
		intro: content?.servicesIntro ?? '',
		services
	};
};
