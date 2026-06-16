# The Drawing Office

SvelteKit + Vercel rebuild of [thedrawingoffice.com](https://thedrawingoffice.com). Content is served by Sanity; the embedded Sanity Studio lives at `/studio`.

## Developing

```sh
bun install
bun run dev          # SvelteKit dev server
```

`/studio` mounts Sanity Studio in the same app. Once you've set the env vars below, visit `http://localhost:5173/studio`.

## Environment variables

A template is in `.env.example`. Copy it to `.env.local` and fill in:

- `PUBLIC_SANITY_PROJECT_ID` — Sanity project ID (from https://www.sanity.io/manage).
- `PUBLIC_SANITY_DATASET` — usually `production`.
- `SANITY_WRITE_TOKEN` — only required locally for seeding. Create an Editor token on the Sanity project's API page.
- `PUBLIC_GA_ID` — GA4 measurement ID (optional).
- `RESEND_API_KEY` — Resend API key for the contact form.
- `RESEND_FROM` — optional From override.

## Seeding Sanity from the legacy JSON

The first time you set up a Sanity dataset, seed it from the JSON snapshots checked into the repo:

```sh
bun run sanity:seed          # idempotent — skips projects that already exist
bun run sanity:seed:reset    # wipes existing project + siteContent docs first
```

The script uploads every image under `static/images/<slug>/` as a Sanity asset and creates one `project` document per slug, plus the `siteContent` singleton.

## Sanity CLI + hosted Studio

The Studio is also deployed to https://the-drawing-office.sanity.studio/ — that's the canonical URL Matt uses to edit content.

```sh
bun run sanity login         # one-time
bun run sanity:deploy        # rebuild + redeploy the hosted Studio after schema changes
```

Locally, `bun run dev` starts both the SvelteKit site (http://localhost:5173, embedded Studio at /studio) and the standalone Sanity Studio (http://localhost:3333).

## Building

```sh
bun run build
bun run preview
```

The Vercel adapter (`@sveltejs/adapter-vercel`) is used by default.
