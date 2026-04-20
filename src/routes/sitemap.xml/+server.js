import projects from '$lib/projects.json';
import { SITE_URL, SITE_NAME } from '$lib/site.js';

export const prerender = true;

const escapeXml = (s) =>
	String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

export function GET() {
	const lastmod = new Date().toISOString().split('T')[0];

	const rootEntries = [
		{ path: '/', images: [{ loc: '/og-default.jpg', title: SITE_NAME }] },
		{ path: '/about', images: [{ loc: '/og/williams.jpg', title: `About — ${SITE_NAME}` }] },
		{ path: '/contact', images: [{ loc: '/og/murray.jpg', title: `Contact — ${SITE_NAME}` }] }
	];

	const projectEntries = projects.map((project) => ({
		path: `/${project.slug}`,
		images: [
			{ loc: `/og/${project.slug}.jpg`, title: `${project.title} — ${SITE_NAME}` },
			...project.images.map((image, i) => ({
				loc: image,
				title: `${project.title} — The Drawing Office, photo ${i + 1} of ${project.images.length}`
			}))
		]
	}));

	const entries = [...rootEntries, ...projectEntries];

	const urls = entries
		.map((entry) => {
			const imageBlocks = entry.images
				.map(
					(image) =>
						`		<image:image>\n			<image:loc>${SITE_URL}${image.loc}</image:loc>\n			<image:title>${escapeXml(image.title)}</image:title>\n		</image:image>`
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
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
