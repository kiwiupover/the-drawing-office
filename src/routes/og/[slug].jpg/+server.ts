import { error } from '@sveltejs/kit';
import { read } from '$app/server';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
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

const PHOTO_W = 1200;
const PHOTO_H = 430;
const PANEL_H = 200;

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
		? urlFor(firstImage as never).width(PHOTO_W).height(PHOTO_H).fit('crop').url()
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
	const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();

	setHeaders({
		'content-type': 'image/jpeg',
		'cache-control': 'public, max-age=300, s-maxage=31536000, immutable'
	});
	return new Response(new Uint8Array(jpeg));
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
				width: '1200px',
				height: '630px',
				backgroundColor: '#111',
				fontFamily: 'Jost'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							width: `${PHOTO_W}px`,
							height: `${PHOTO_H}px`,
							backgroundColor: '#222',
							backgroundImage: bg ? `url(${bg})` : undefined,
							backgroundSize: `${PHOTO_W}px ${PHOTO_H}px`,
							backgroundPosition: 'center'
						}
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							width: `${PHOTO_W}px`,
							height: `${PANEL_H}px`,
							padding: '34px 60px',
							backgroundColor: '#111',
							color: '#fff',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						},
						children: [
							{
								type: 'div',
								props: {
									style: { display: 'flex', flexDirection: 'column' },
									children: [
										{
											type: 'div',
											props: {
												style: {
													fontSize: '20px',
													fontWeight: 500,
													letterSpacing: '0.18em',
													textTransform: 'uppercase',
													opacity: 0.7,
													marginBottom: '14px'
												},
												children: 'The Drawing Office'
											}
										},
										{
											type: 'div',
											props: {
												style: {
													fontSize: '68px',
													fontWeight: 700,
													letterSpacing: '-0.02em',
													lineHeight: 1
												},
												children: title
											}
										}
									]
								}
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-end',
										gap: '10px'
									},
									children: [
										{
											type: 'div',
											props: {
												style: {
													display: 'flex',
													padding: '14px 28px',
													borderRadius: '999px',
													backgroundColor: '#fff',
													color: '#111',
													fontSize: '24px',
													fontWeight: 500
												},
												children: 'View project'
											}
										},
										{
											type: 'div',
											props: {
												style: { fontSize: '18px', opacity: 0.7 },
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
