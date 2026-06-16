import { error } from '@sveltejs/kit';
import { sanity, urlFor } from '$lib/sanity';
import { projectListFullQuery } from '$lib/queries';
import { safeTerminology } from '$lib/safe-terms.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

type SanityImage = {
	asset?: {
		_ref?: string;
		_id?: string;
		metadata?: { dimensions?: { width?: number; height?: number } };
	};
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

function dimsFromAsset(asset: NonNullable<SanityImage['asset']>) {
	const meta = asset.metadata?.dimensions;
	if (meta?.width && meta?.height) return { width: meta.width, height: meta.height };
	const ref = asset._id ?? asset._ref ?? '';
	const m = ref.match(/-(\d+)x(\d+)-/);
	return m ? { width: Number(m[1]), height: Number(m[2]) } : { width: 0, height: 0 };
}

function expandImages(images: SanityImage[]) {
	return images
		.filter((img): img is SanityImage & { asset: NonNullable<SanityImage['asset']> } =>
			Boolean(img?.asset)
		)
		.map((img) => {
			const { width, height } = dimsFromAsset(img.asset);
			return {
				src: urlFor(img as never).width(2000).fit('max').url(),
				thumb: urlFor(img as never).width(800).fit('max').url(),
				alt: img.alt ?? '',
				width,
				height
			};
		});
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

	const seoOg = raw.seo?.image?.asset
		? urlFor(raw.seo.image as never).width(1200).height(630).fit('crop').url()
		: null;

	return {
		project: {
			slug: raw.slug,
			title: raw.title,
			description: safeTerminology(raw.description) ?? null,
			images: expandImages(raw.images ?? []),
			ogImage: seoOg ?? `/og/${raw.slug}.jpg`,
			seoTitle: safeTerminology(raw.seo?.title) ?? null,
			seoDescription: safeTerminology(raw.seo?.description) ?? null
		},
		prev: { slug: prevRaw.slug, title: prevRaw.title },
		next: { slug: nextRaw.slug, title: nextRaw.title }
	};
};
