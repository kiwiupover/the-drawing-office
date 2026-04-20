# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Environment variables

The private `/studio` content editor reads the following variables. A template is in `.env.example`.

- `ADMIN_PASSWORD` — shared password for the `/studio` login form.
- `ADMIN_SESSION_SECRET` — long random string used to sign the admin session cookie (HMAC-SHA-256).
- `GITHUB_TOKEN` — fine-grained PAT with contents read/write on this repo only.
- `GITHUB_OWNER` — GitHub account or org that owns the repo.
- `GITHUB_REPO` — repo name.
- `GITHUB_BRANCH` — deploy branch the editor commits to (usually `main`).
