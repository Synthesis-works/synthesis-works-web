# Synthesis Works — organisation site

The public site for Synthesis Works, the organisation behind **Atlas**. It owns the
marketing surface: the home page with the video hero and story sections, plus Platform,
Benchmarks, Research, Documentation, CLI, Open Source and Sandbox.

Atlas itself is a **separate site on a separate origin** (`apps/landing` in the
`Synthesis-works/atlas` repo). Nothing is shared at runtime — no router, no auth, no
cookies. The only connection is an absolute URL, so:

- a visitor can go **parent → child** via "Enter Atlas", and
- a visitor can go **straight to Atlas** without ever touching this site.

That is deliberate. This repo must not import product code from Atlas, and Atlas must
not depend on this site to render.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — video hero, about, approach, philosophy, scientific-by-design, services |
| `/platform` | Platform |
| `/benchmarks` | Benchmarks (reads the public Atlas API) |
| `/research` | Research |
| `/documentation` | Documentation |
| `/cli`, `/cli/install` | CLI overview and install guide |
| `/open-source` | Open source |
| `/sandbox` | Interactive sandbox demo |
| `*` | Redirect to `/` |

## The one cross-site link

`src/config/site.ts` holds `ATLAS_URL`, read from `VITE_ATLAS_URL`. "Enter Atlas"
(`src/core/ExperienceController.tsx`) plays the transition and then does a full
`window.location.assign(...)` to the Atlas origin. Change the env var in Vercel to
repoint the site; no code change needed.

## Local development

```bash
npm ci
npm run dev        # http://localhost:5174
```

Port 5174 keeps it clear of the Atlas app on 5173, so both can run at once.

`npm run dev` needs the API for the Benchmarks page only. Either point
`VITE_API_BASE_URL` at the deployed API (see `.env.example`) or run the Atlas backend
on `http://localhost:8000`.

## Quality gates

```bash
npx tsc -b      # type check
npm run lint    # oxlint
npm run build   # tsc -b + vite build
```

There is no test suite in this repo yet.

## Deployment

Vercel, this repository as the project root. `vercel.json` rewrites every path to
`index.html` so the client-side router handles deep links.

Set these environment variables on the Vercel project:

| Variable | Purpose |
| --- | --- |
| `VITE_ATLAS_URL` | Absolute URL of the Atlas site, e.g. `https://atlas.synthesis-works.xyz` |
| `VITE_API_BASE_URL` | Public Atlas API base URL |

## Provenance

The pages, layout, design system and assets here were extracted from
`Synthesis-works/atlas` (`apps/landing`) at the point where the new agent landing page
replaced the old home page. Only the marketing surface was copied — 157 source files —
and the only deliberate change is that "Enter Atlas" now navigates cross-origin
instead of routing to `/dashboard` in the same app.

## Adding pages

Marketing pages belong here. If a page needs a signed-in session, a workspace shell or
any Atlas product data beyond the public API, it belongs in the Atlas repo instead.
