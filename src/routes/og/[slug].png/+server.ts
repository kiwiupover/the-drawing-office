import { error } from '@sveltejs/kit';
import { read } from '$app/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { sanity, urlFor } from '$lib/sanity';
import jostBoldFile from '$lib/og/Jost-Bold.ttf';
import jostMediumFile from '$lib/og/Jost-Medium.ttf';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

const jostBold = await read(jostBoldFile).arrayBuffer();
const jostMedium = await read(jostMediumFile).arrayBuffer();

type ProjectRow = {
	slug: string;
	title: string;
	images?: Array<{ asset?: { _id?: string; _ref?: string } }>;
};

export const entries: EntryGenerator = async () => {
	const projects = await sanity.fetch<Array<{ slug: string }>>(
		`*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
	);
	return (projects ?? []).map((p) => ({ slug: p.slug }));
};

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	const project = await sanity.fetch<ProjectRow | null>(
		`*[_type == "project" && slug.current == $slug][0]{
			"slug": slug.current,
			title,
			"images": gallery[]{ asset->{ _id } }
		}`,
		{ slug: params.slug }
	);
	if (!project) throw error(404, 'Project not found');

	const firstImage = (project.images ?? []).find((img) => img?.asset);
	const bgUrl = firstImage
		? urlFor(firstImage as never).width(1200).height(630).fit('crop').url()
		: null;

	const bgDataUrl = bgUrl ? await fetchAsDataUrl(bgUrl) : null;

	const svg = await satori(template({ title: project.title, bg: bgDataUrl }), {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Jost', data: jostBold, weight: 700, style: 'normal' },
			{ name: 'Jost', data: jostMedium, weight: 500, style: 'normal' }
		]
	});

	const png = new Resvg(svg).render().asPng();

	setHeaders({
		'content-type': 'image/png',
		'cache-control': 'public, max-age=300, s-maxage=31536000, immutable'
	});
	return new Response(new Uint8Array(png));
};

async function fetchAsDataUrl(url: string): Promise<string | null> {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const buf = Buffer.from(await res.arrayBuffer());
		const mime = res.headers.get('content-type') ?? 'image/jpeg';
		return `data:${mime};base64,${buf.toString('base64')}`;
	} catch {
		return null;
	}
}

function template({ title, bg }: { title: string; bg: string | null }) {
	const root: Record<string, unknown> = {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',
				width: '1200px',
				height: '630px',
				backgroundColor: '#111',
				backgroundImage: bg ? `url(${bg})` : undefined,
				backgroundSize: '1200px 630px',
				backgroundPosition: 'center',
				color: '#fff',
				fontFamily: 'Jost',
				position: 'relative'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							inset: '0',
							display: 'flex',
							background:
								'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.85) 100%)'
						}
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							padding: '60px 72px',
							zIndex: '1'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: '22px',
										fontWeight: 500,
										letterSpacing: '0.18em',
										textTransform: 'uppercase',
										opacity: 0.8,
										marginBottom: '18px'
									},
									children: 'The Drawing Office'
								}
							},
							{
								type: 'div',
								props: {
									style: {
										fontSize: '92px',
										fontWeight: 700,
										letterSpacing: '-0.02em',
										lineHeight: 1.02,
										marginBottom: '28px',
										textShadow: '0 2px 24px rgba(0,0,0,0.45)'
									},
									children: title
								}
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										alignItems: 'center',
										gap: '14px',
										fontSize: '26px',
										fontWeight: 500
									},
									children: [
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													padding: '12px 22px',
													borderRadius: '999px',
													backgroundColor: '#fff',
													color: '#111'
												},
												children: 'View project'
											}
										},
										{
											type: 'div',
											props: {
												style: { opacity: 0.85 },
												children: 'thedrawingoffice.com'
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	};
	return root as never;
}
