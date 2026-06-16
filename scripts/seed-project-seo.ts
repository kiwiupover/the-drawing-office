#!/usr/bin/env bun
/**
 * Backfill SEO title + description on every project doc.
 * Idempotent — re-run safely; preserves any existing seo.image.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
loadDotEnv(path.join(ROOT, '.env.local'));

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
	console.error('Missing env: PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN required.');
	process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2026-06-01', token, useCdn: false });

// Local-SEO frame for an Auckland (Browns Bay) residential architect.
// - Lead with the project name (branded search) + a high-intent service keyword
//   ("residential architect", "Auckland architect", "new home").
// - Anchor each description in a real NZ place signal (Auckland, North Shore, Browns Bay, NZ).
// - Keep titles ≤60ch and descriptions ≤160ch so they don't truncate in SERPs.
const seoBySlug: Record<string, { title: string; description: string }> = {
	potier: {
		title: 'Potier House — Residential Architect, Auckland NZ',
		description:
			'A new home shaped by close conversations with the clients and the particulars of the site. The Potier house by The Drawing Office, Auckland architects.'
	},
	dorn: {
		title: 'Dorn Residence — Auckland Architect | The Drawing Office',
		description:
			'A simple, confident idea carried through siting, plan, joinery and openings. The Dorn residence by The Drawing Office — residential architects, Auckland NZ.'
	},
	evans: {
		title: 'Evans House — Auckland Family Home Architect',
		description:
			'A family home with everyday life at its core and quieter rooms at the edges. The Evans house by The Drawing Office — residential architects, Auckland NZ.'
	},
	murray: {
		title: 'Murray Home — Bespoke New Home Architect, NZ',
		description:
			'A bespoke New Zealand home shaped by site, brief and a long client conversation. The Murray home by The Drawing Office — Auckland residential architects.'
	},
	williams: {
		title: 'Williams House — Site-Responsive New Home, Auckland',
		description:
			'A home that settles into its site, with the plan shaped by the contours and the path of the sun. Williams by The Drawing Office, Auckland architects.'
	},
	beechwood: {
		title: 'Beechwood Residence — Auckland Residential Architect',
		description:
			'A new home refined through every stage from first concepts to on-site detailing. Beechwood by The Drawing Office — residential architects, Auckland NZ.'
	},
	schwane: {
		title: 'Mt Wellington House — Auckland Home Architect',
		description:
			'A home that opens to the garden where it matters, with sheltered edges for less forgiving NZ days. Mt Wellington by The Drawing Office, Auckland architects.'
	},
	nacht: {
		title: 'McCaffery Residence — Auckland Architect for Light',
		description:
			'A home drawn around light, volume and how each room is used from morning to evening. McCaffery by The Drawing Office — Auckland residential architects.'
	},
	elington: {
		title: 'Elington House — Auckland Architect | The Drawing Office',
		description:
			"A new home balancing openness to the view with privacy from the street, shaped by the site's lines. Elington by The Drawing Office, Auckland architects."
	},
	gebaude: {
		title: 'Ruby Home — North Shore Family Home Architect',
		description:
			'A home designed around the small moments — the kitchen, the threshold, the morning light. Ruby by The Drawing Office — residential architects, Auckland NZ.'
	},
	weg: {
		title: 'Vyle House — Sun-and-Outlook Home, Auckland NZ',
		description:
			'A new home oriented to the sun and the outlook, with main living spaces placed to make the most of both. Vyle by The Drawing Office, Auckland architects.'
	},
	maritime: {
		title: 'Vicelich Residence — Coastal NZ Architect',
		description:
			'A residence designed for its New Zealand setting, detailed to weather well and age in place. Vicelich by The Drawing Office — Auckland residential architects.'
	},
	vergnugungspark: {
		title: 'Locking Home — Considered NZ New Home Architect',
		description:
			'A carefully-scaled home drawn around a clear idea and a well-tested brief. Locking by The Drawing Office — residential architects, Browns Bay, Auckland.'
	}
};

const slugs = Object.keys(seoBySlug);
console.log(`Patching SEO on ${slugs.length} projects in ${projectId}/${dataset}...`);

for (let i = 0; i < slugs.length; i++) {
	const slug = slugs[i];
	const { title, description } = seoBySlug[slug];
	await client
		.patch(`project.${slug}`)
		.set({ seo: { _type: 'seo', title, description } })
		.commit();
	console.log(
		`  [${i + 1}/${slugs.length}] ${slug} — title ${title.length}ch / desc ${description.length}ch`
	);
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
