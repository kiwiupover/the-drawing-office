#!/usr/bin/env bun
import { parse } from 'node-html-parser';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const SITE = 'https://www.thedrawingoffice.com';
const ROOT = resolve(import.meta.dir, '..');
const IMAGES_DIR = join(ROOT, 'static', 'images');
const MANIFEST_PATH = join(ROOT, 'src', 'lib', 'projects.json');
const UA = 'Mozilla/5.0 (compatible; drawing-office-migrate/1.0)';
const PROJECT_CONCURRENCY = 4;

type Project = {
	slug: string;
	title: string;
	description: string | null;
	images: string[];
};

async function fetchText(url: string, retries = 1): Promise<string> {
	let lastErr: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url, { headers: { 'user-agent': UA } });
			if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
			return await res.text();
		} catch (err) {
			lastErr = err;
		}
	}
	throw lastErr;
}

async function fetchBytes(url: string, retries = 1): Promise<ArrayBuffer> {
	let lastErr: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url, { headers: { 'user-agent': UA } });
			if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
			return await res.arrayBuffer();
		} catch (err) {
			lastErr = err;
		}
	}
	throw lastErr;
}

function extractProjectCards(html: string): { slug: string; title: string }[] {
	const root = parse(html);
	const cards = root.querySelectorAll('a.project');
	const out: { slug: string; title: string }[] = [];
	const seen = new Set<string>();
	for (const a of cards) {
		const href = a.getAttribute('href') ?? '';
		const match = href.match(/^\/([^/]+)\/?$/);
		if (!match) continue;
		const slug = match[1];
		if (seen.has(slug)) continue;
		seen.add(slug);
		const titleEl = a.querySelector('.project-title');
		const title = (titleEl?.text ?? slug).trim();
		out.push({ slug, title });
	}
	return out;
}

function extractGalleryImages(html: string): string[] {
	const root = parse(html);
	const imgs = root.querySelectorAll('img');
	const seen = new Set<string>();
	const ordered: string[] = [];
	for (const img of imgs) {
		// skip tiny-thumb duplicates — they're in a separate container but we dedupe by URL anyway
		const parent = img.parentNode;
		if (parent && parent.classList?.contains('tiny-thumb')) continue;
		const raw = img.getAttribute('data-image') || img.getAttribute('data-src') || img.getAttribute('src') || '';
		if (!raw.includes('images.squarespace-cdn.com')) continue;
		const clean = raw.split('?')[0];
		if (seen.has(clean)) continue;
		seen.add(clean);
		ordered.push(clean);
	}
	return ordered;
}

function pad(n: number, width = 2): string {
	return n.toString().padStart(width, '0');
}

async function downloadImagesForProject(
	slug: string,
	imageUrls: string[]
): Promise<string[]> {
	const dir = join(IMAGES_DIR, slug);
	await rm(dir, { recursive: true, force: true });
	await mkdir(dir, { recursive: true });
	const out: string[] = [];
	// sequential within a project (be nice)
	for (let i = 0; i < imageUrls.length; i++) {
		const url = `${imageUrls[i]}?format=2500w`;
		const bytes = await fetchBytes(url);
		const name = `${pad(i + 1)}.jpg`;
		await Bun.write(join(dir, name), bytes);
		out.push(`/images/${slug}/${name}`);
	}
	return out;
}

async function runWithConcurrency<T, R>(
	items: T[],
	limit: number,
	worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let cursor = 0;
	const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
		while (true) {
			const idx = cursor++;
			if (idx >= items.length) return;
			results[idx] = await worker(items[idx], idx);
		}
	});
	await Promise.all(runners);
	return results;
}

async function main() {
	console.log(`[scrape] fetching homepage ${SITE}/`);
	const homeHtml = await fetchText(`${SITE}/`);
	const cards = extractProjectCards(homeHtml);
	console.log(`[scrape] found ${cards.length} projects`);
	for (const c of cards) console.log(`  - ${c.slug} (${c.title})`);

	await mkdir(IMAGES_DIR, { recursive: true });

	const manifest: Project[] = new Array(cards.length);
	let done = 0;

	await runWithConcurrency(cards, PROJECT_CONCURRENCY, async (card, idx) => {
		const url = `${SITE}/${card.slug}/`;
		try {
			const html = await fetchText(url);
			const imageUrls = extractGalleryImages(html);
			const localImages = await downloadImagesForProject(card.slug, imageUrls);
			manifest[idx] = {
				slug: card.slug,
				title: card.title,
				description: null,
				images: localImages,
			};
			done++;
			console.log(`[${done}/${cards.length}] ${card.slug}: downloaded ${localImages.length} images`);
		} catch (err) {
			done++;
			console.error(`[${done}/${cards.length}] ${card.slug}: FAILED — ${(err as Error).message}`);
			manifest[idx] = {
				slug: card.slug,
				title: card.title,
				description: null,
				images: [],
			};
		}
	});

	await mkdir(join(ROOT, 'src', 'lib'), { recursive: true });
	await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
	const totalImages = manifest.reduce((n, p) => n + p.images.length, 0);
	console.log(`[scrape] wrote ${MANIFEST_PATH} — ${manifest.length} projects, ${totalImages} images`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
