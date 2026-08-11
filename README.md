# DeenHub

An Islamic knowledge platform prototype — Quran reader (with tajweed colors),
Hadith search, Fiqh/Aqeedah topics, Scholars, Duas, prayer times, Qibla, and
a mosque finder. Built with React + Vite + Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `deenhub`) and push this project to it (see
   the command block below).
2. In `vite.config.js`, set `base` to `"/YOUR-REPO-NAME/"` (already set to
   `"/deenhub/"` — change it if you name the repo something else).
3. In your repo on GitHub: **Settings → Pages → Build and deployment →
   Source → GitHub Actions**.
4. Push to the `main` branch. The included workflow
   (`.github/workflows/deploy.yml`) will automatically build and publish the
   site to `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/` within a
   minute or two.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

That's it — no manual `npm run build` or `gh-pages` step needed; the Action
handles it on every push.
