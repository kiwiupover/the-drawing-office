#!/usr/bin/env bun
/**
 * Seed the Sanity dataset from the legacy JSON + static images.
 *
 * Usage:
 *   bun run sanity:seed          # idempotent: skip projects that are already published
 *   bun run sanity:seed:reset    # delete existing project + siteContent docs first
 *
 * Required env (in .env.local):
 *   PUBLIC_SANITY_PROJECT_ID
 *   PUBLIC_SANITY_DATASET
 *   SANITY_WRITE_TOKEN  (Editor or higher; create at https://www.sanity.io/manage)
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

type LegacyProject = {
	slug: string;
	title: string;
	description: string | null;
	images: string[];
};

type LegacyContent = {
	home?: { intro?: string };
	about?: string;
	contact?: { intro?: string };
	services?: { intro?: string; items?: Array<{ title?: string; body?: string }> };
	process?: { intro?: string; stages?: Array<{ name?: string; body?: string }> };
	faq?: { intro?: string; items?: Array<{ q?: string; a?: string }> };
};

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const PROJECTS_JSON = path.join(ROOT, 'src/lib/projects.json');
const CONTENT_JSON = path.join(ROOT, 'src/lib/content.json');

loadDotEnv(path.join(ROOT, '.env.local'));

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
	console.error(
		'Missing required env. Set PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local'
	);
	process.exit(1);
}

const reset = process.argv.includes('--reset');

const client = createClient({
	projectId,
	dataset,
	apiVersion: '2026-06-01',
	token,
	useCdn: false
});

const projects: LegacyProject[] = JSON.parse(fs.readFileSync(PROJECTS_JSON, 'utf8'));
const content: LegacyContent = JSON.parse(fs.readFileSync(CONTENT_JSON, 'utf8'));

if (reset) {
	console.log('Resetting: deleting existing project + siteContent documents...');
	await client.delete({ query: '*[_type == "project"]' });
	await client.delete({ query: '*[_type == "siteContent"]' });
}

console.log(`Seeding ${projects.length} projects into ${projectId}/${dataset}...`);

for (let i = 0; i < projects.length; i++) {
	const p = projects[i];
	const publishedId = `project.${p.slug}`;
	const draftId = `drafts.${publishedId}`;
	const existing = await client.getDocument(publishedId).catch(() => null);
	const published = existing && (existing as { _system?: { base?: unknown } })._system?.base;
	if (published && !reset) {
		console.log(`  [${i + 1}/${projects.length}] ${p.slug} — already published, skipping`);
		continue;
	}

	let gallery: Array<Record<string, unknown>> | undefined = (
		existing as { gallery?: Array<Record<string, unknown>> } | null
	)?.gallery;
	if (!gallery || gallery.length === 0) {
		gallery = [];
		for (const relPath of p.images) {
			const absPath = path.join(ROOT, 'static', relPath.replace(/^\//, ''));
			if (!fs.existsSync(absPath)) {
				console.warn(`     ! missing image ${absPath} — skipping`);
				continue;
			}
			const buffer = fs.readFileSync(absPath);
			const filename = path.basename(absPath);
			const asset = await client.assets.upload('image', buffer, { filename });
			gallery.push({
				_key: cryptoKey(),
				_type: 'image',
				asset: { _type: 'reference', _ref: asset._id }
			});
		}
	}

	await client.createOrReplace({
		_id: draftId,
		_type: 'project',
		title: p.title,
		slug: { _type: 'slug', current: p.slug },
		description: p.description ?? null,
		orderRank: lexorank(i),
		gallery
	});

	await publishDoc(publishedId, draftId);

	console.log(`  [${i + 1}/${projects.length}] ${p.slug} — published with ${gallery.length} images`);
}

const siteFields = {
	homeIntro: content.home?.intro ?? '',
	about: content.about ?? '',
	contactIntro: content.contact?.intro ?? '',
	servicesIntro: content.services?.intro ?? '',
	services: (content.services?.items ?? []).map((item) => ({
		_key: cryptoKey(),
		title: item.title ?? '',
		body: item.body ?? ''
	})),
	processIntro: content.process?.intro ?? '',
	process: (content.process?.stages ?? []).map((stage) => ({
		_key: cryptoKey(),
		name: stage.name ?? '',
		body: stage.body ?? ''
	})),
	faqIntro: content.faq?.intro ?? '',
	faq: (content.faq?.items ?? []).map((item) => ({
		_key: cryptoKey(),
		q: item.q ?? '',
		a: item.a ?? ''
	}))
};

const siteDraftId = 'drafts.siteContent';

if (reset) {
	console.log('Seeding siteContent singleton (reset: overwriting)...');
	await client.createOrReplace({ _id: siteDraftId, _type: 'siteContent', ...siteFields });
	await publishDoc('siteContent', siteDraftId);
} else {
	// Patch-only: never clobber copy already edited in Studio. setIfMissing adds
	// the new Services/Process/FAQ sections (and any base field that doesn't exist
	// yet) without touching existing values.
	console.log('Seeding siteContent singleton (patch: only filling missing fields)...');
	await client.createIfNotExists({ _id: 'siteContent', _type: 'siteContent' });
	await client.patch('siteContent').setIfMissing(siteFields).commit();
	const existingDraft = await client.getDocument(siteDraftId).catch(() => null);
	if (existingDraft) {
		await client.patch(siteDraftId).setIfMissing(siteFields).commit();
	}
}

console.log('Done.');

function cryptoKey() {
	return Math.random().toString(36).slice(2, 14);
}

function lexorank(i: number) {
	const seq = (i + 1).toString(26).padStart(6, '0');
	const letters = seq
		.split('')
		.map((c) => String.fromCharCode(97 + parseInt(c, 26)))
		.join('');
	return `0|${letters}:`;
}

async function publishDoc(publishedId: string, draftId: string) {
	const url = `https://${projectId}.api.sanity.io/v2026-06-01/data/actions/${dataset}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			actions: [
				{
					actionType: 'sanity.action.document.publish',
					publishedId,
					draftId
				}
			]
		})
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Publish failed for ${publishedId}: ${res.status} ${body}`);
	}
}

function loadDotEnv(file: string) {
	if (!fs.existsSync(file)) return;
	for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const eq = trimmed.indexOf('=');
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (!(key in process.env)) process.env[key] = value;
	}
}
