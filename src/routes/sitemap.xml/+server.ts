import { sanity, urlFor } from '$lib/sanity';
import { projectListFullQuery } from '$lib/queries';
import { SITE_URL, SITE_NAME } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

type SitemapImage = { loc: string; title: string };
type SitemapEntry = { path: string; images: SitemapImage[] };

type SanityImage = { asset?: { _ref?: string; _id?: string }; alt?: string };
type RawProject = { slug: string; title: string; images?: SanityImage[] };

const escapeXml = (s: string) =>
	String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString().split('T')[0];
	const projects = (await sanity.fetch<RawProject[]>(projectListFullQuery)) ?? [];

	const rootEntries: SitemapEntry[] = [
		{ path: '/', images: [{ loc: '/og-default.jpg', title: SITE_NAME }] },
		{ path: '/about', images: [] },
		{ path: '/contact', images: [] }
	];

	const projectEntries: SitemapEntry[] = projects.map((project) => {
		const galleryImages = project.images ?? [];
		const images = galleryImages
			.filter((img): img is SanityImage & { asset: NonNullable<SanityImage['asset']> } =>
				Boolean(img?.asset)
			)
			.map((img, i) => ({
				loc: urlFor(img as never).width(2000).fit('max').url(),
				title: `${project.title} — The Drawing Office, photo ${i + 1} of ${galleryImages.length}`
			}));

		return { path: `/${project.slug}`, images };
	});

	const entries = [...rootEntries, ...projectEntries];

	const urls = entries
		.map((entry) => {
			const imageBlocks = entry.images
				.map(
					(image) =>
						`		<image:image>\n			<image:loc>${escapeXml(image.loc.startsWith('http') ? image.loc : `${SITE_URL}${image.loc}`)}</image:loc>\n			<image:title>${escapeXml(image.title)}</image:title>\n		</image:image>`
				)
				.join('\n');
			return `	<url>\n		<loc>${SITE_URL}${entry.path}</loc>\n		<lastmod>${lastmod}</lastmod>\n${imageBlocks}\n	</url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
