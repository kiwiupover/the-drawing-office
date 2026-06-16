#!/usr/bin/env bun
/**
 * Backfill orderRank on existing project docs in the order they appear in projects.json.
 * Run once after enabling the orderable-document-list plugin.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

type LegacyProject = { slug: string };

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
loadDotEnv(path.join(ROOT, '.env.local'));

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
	console.error('Missing env: PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN required.');
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion: '2026-06-01',
	token,
	useCdn: false
});

const projects: LegacyProject[] = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'src/lib/projects.json'), 'utf8')
);

function rankFor(i: number) {
	const seq = (i + 1).toString(26).padStart(6, '0');
	const letters = seq
		.split('')
		.map((c) => String.fromCharCode(97 + parseInt(c, 26)))
		.join('');
	return `0|${letters}:`;
}

for (let i = 0; i < projects.length; i++) {
	const p = projects[i];
	const orderRank = rankFor(i);
	await client.patch(`project.${p.slug}`).set({ orderRank }).commit();
	console.log(`  [${i + 1}/${projects.length}] ${p.slug} ← orderRank=${orderRank}`);
}

console.log('Done.');

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
