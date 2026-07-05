# How this site works — build, publish & redeploy

A plain-English guide to the SYNAPSE portfolio (https://sushantzd.github.io).

## Repository visibility
This repo is **public**. That's required for a free GitHub Pages *user site*
(`username.github.io`) — private Pages needs paid GitHub Pro. Public is fine and
even helpful for a portfolio: recruiters can see the source. Nothing sensitive
lives here (see "Secrets" below).

## Two branches (important)
| Branch      | What it holds            | Who reads it            |
|-------------|--------------------------|-------------------------|
| `main`      | The **source code**      | You / other developers  |
| `gh-pages`  | The **built website** (`out/`) | GitHub Pages (the live site) |

GitHub Pages serves the **`gh-pages`** branch. So:

> **Pushing to `main` updates the code, but does NOT update the live site.**
> The live site only changes when new built files land on `gh-pages`.

## How it's built on your PC
1. You edit source files (most content lives in `src/data/resume.ts`).
2. `npm run build` compiles the Next.js app into a fully static site in the
   `out/` folder (plain HTML/CSS/JS — no server needed).

## How it's published
`out/` is force-pushed to the `gh-pages` branch. GitHub Pages then serves those
static files at https://sushantzd.github.io within ~30–60 seconds.

The `deploy.ps1` script does the build + publish in one step.

## Redeploy after any change
From the project root in PowerShell:

```powershell
# optional: save your source history
git add -A
git commit -m "describe your change"
git push                # updates source on main (NOT the live site)

# this is what actually updates the live site:
./deploy.ps1            # builds + publishes to gh-pages
```

`deploy.ps1` builds from your **local files**, so whatever is saved on your PC is
what goes live. You don't have to push to `main` first — but it's good practice.

## Editing content
All text (name, roles, skills, experience, projects, education, achievements,
contact links) is in **`src/data/resume.ts`**. Change it there, then `./deploy.ps1`.

## Secrets / the contact form key
- `.env.local` is **gitignored** — never committed.
- The contact form uses **Web3Forms**. Its `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is a
  **public client key by design** (it belongs in front-end code). It is safe to be
  visible in the public build. Lock it to your domain + enable spam protection in
  the Web3Forms dashboard for extra safety.
- To make the form deliver email: put the key in `.env.local`, then `./deploy.ps1`
  (the key is baked into the build).

## Optional: auto-deploy on every push
If you'd rather skip `deploy.ps1` and have GitHub build + deploy automatically on
every push to `main`, enable the ready-made workflow:

```powershell
gh auth refresh -s workflow                        # one-time (opens browser)
Copy-Item docs/github-pages-deploy.yml.txt .github/workflows/deploy.yml
git add .github; git commit -m "ci: pages deploy"; git push
```

Then in the repo: **Settings → Pages → Source → GitHub Actions**, and add a repo
secret `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. After that, `git push` alone deploys.

## Alternative host: Vercel
You're logged into Vercel in Chrome. To also publish there (nicer domain like
`sushantzd.vercel.app`), from the project root:

```powershell
npx vercel --prod
```
