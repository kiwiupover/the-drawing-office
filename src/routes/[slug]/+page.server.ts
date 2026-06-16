import { error } from '@sveltejs/kit';
import { sanity, urlFor } from '$lib/sanity';
import { projectListFullQuery } from '$lib/queries';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

type SanityImage = {
	asset?: { _ref?: string; _id?: string };
	alt?: string;
};

type RawProject = {
	slug: string;
	title: string;
	description?: string | null;
	images?: SanityImage[];
	seo?: {
		title?: string | null;
		description?: string | null;
		image?: SanityImage | null;
	} | null;
};

function expandImages(images: SanityImage[]) {
	return images
		.filter((img): img is SanityImage & { asset: NonNullable<SanityImage['asset']> } =>
			Boolean(img?.asset)
		)
		.map((img) => ({
			src: urlFor(img as never).width(2000).fit('max').url(),
			thumb: urlFor(img as never).width(800).fit('max').url(),
			alt: img.alt ?? ''
		}));
}

export const entries: EntryGenerator = async () => {
	const projects = await sanity.fetch<Array<{ slug: string }>>(
		`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
	);
	return (projects ?? []).map((p) => ({ slug: p.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const projects = await sanity.fetch<RawProject[]>(projectListFullQuery);
	const idx = (projects ?? []).findIndex((p) => p.slug === params.slug);
	if (idx === -1) throw error(404, 'Project not found');

	const raw = projects[idx];
	const prevRaw = projects[(idx - 1 + projects.length) % projects.length];
	const nextRaw = projects[(idx + 1) % projects.length];

	const firstImage = (raw.images ?? []).find((img) => img?.asset);
	const galleryOg = firstImage
		? urlFor(firstImage as never).width(1200).height(630).fit('crop').url()
		: null;
	const seoOg = raw.seo?.image?.asset
		? urlFor(raw.seo.image as never).width(1200).height(630).fit('crop').url()
		: null;

	return {
		project: {
			slug: raw.slug,
			title: raw.title,
			description: raw.description ?? null,
			images: expandImages(raw.images ?? []),
			ogImage: seoOg ?? galleryOg,
			seoTitle: raw.seo?.title ?? null,
			seoDescription: raw.seo?.description ?? null
		},
		prev: { slug: prevRaw.slug, title: prevRaw.title },
		next: { slug: nextRaw.slug, title: nextRaw.title }
	};
};
