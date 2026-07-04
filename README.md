# SYNAPSE

**AI Engineer portfolio for Sushant Choudhary** — a single-page, motion-rich
personal site built with Next.js and shipped as a fully static export.

Live: **https://sushantzd.github.io**

It presents the story end to end — hero with an animated neural field, about,
skills, experience timeline, selected work, education, achievements and a
working contact form — with a "Midnight Neural" design system, smooth scrolling,
scroll-reveal motion and a custom cursor. Everything degrades gracefully under
`prefers-reduced-motion` and on touch devices.

## Tech stack

- **Next.js 15** (App Router) — static export (`output: 'export'`)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + a hand-authored design-token system in `globals.css`
- **Framer Motion** — section reveals, magnetic buttons, mobile menu
- **Lenis** — smooth scroll
- **HTML Canvas** — the hero neural field (lightweight, no WebGL dependency at runtime)
- **Web3Forms** — serverless contact form delivery
- **lucide-react** — icons

## Local development

```bash
npm install       # install dependencies (Node 20+; developed on Node 24)
npm run dev       # start the dev server → http://localhost:3000
npm run build     # production static export → ./out
npm run serve     # preview the built ./out locally
```

`npm run build` produces a fully static site in **`out/`** (including
`sitemap.xml`, `robots.txt` and the generated app icon). That directory is what
gets deployed.

## Contact form (Web3Forms setup)

The contact form posts to [Web3Forms](https://web3forms.com), so there is no
backend to run. You need a free access key:

1. Go to **https://web3forms.com** and enter your email to get a free access key.
2. Provide the key as the `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` environment variable:
   - **Local:** copy `.env.local.example` to `.env.local` and set
     `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here`.
   - **GitHub Pages deploy:** add a repository secret named
     `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (Settings → Secrets and variables →
     Actions) so the Pages build inlines it.

The key is public/safe to expose — it only permits sending mail to *your* inbox.
`NEXT_PUBLIC_` variables are inlined at build time, which is required for a
static export. Without a key the form renders but submissions will fail, so set
it before deploying.

## Deploy

### GitHub Pages (primary)

Deployed as a **user site at the root** `https://sushantzd.github.io`
(repo `sushantzd/sushantzd.github.io`) — no `basePath`. A GitHub Actions
workflow builds the site and publishes `out/` to Pages on push. Make sure the
`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` repo secret is set (see above) so the contact
form works on the live site.

### Vercel (fallback)

```bash
npx vercel --prod
```

## Editing content

**All copy lives in [`src/data/resume.ts`](src/data/resume.ts)** — personal
details, socials, stats, skills, experience, projects, education, achievements
and the nav links. Edit that one typed module; every section consumes it, so
there is no hardcoded copy to hunt down in the components.
