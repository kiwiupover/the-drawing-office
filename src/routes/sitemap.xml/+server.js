import projects from '$lib/projects.json';
import { SITE_URL } from '$lib/site.js';

export const prerender = true;

export function GET() {
	const lastmod = new Date().toISOString().split('T')[0];
	const paths = ['/', '/about', '/contact', ...projects.map((p) => `/${p.slug}`)];

	const urls = paths
		.map(
			(path) =>
				`	<url>\n		<loc>${SITE_URL}${path}</loc>\n		<lastmod>${lastmod}</lastmod>\n	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
