# Hamza Jameel — Portfolio

A React + Vite single-page portfolio. Deploys to GitHub Pages automatically on every push.

## Run locally
```bash
npm install
npm run dev        # open the URL it prints (usually http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # preview the production build
```

## Deploy to GitHub Pages (free)

1. Create a new **public** repo on GitHub (e.g. `portfolio`).
2. In this folder, push the code:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/DShamzaj/portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. That's it. The included workflow builds and publishes on every push to `main`.
   Your site will be live at: `https://DShamzaj.github.io/portfolio/`

### Want it at the root (DShamzaj.github.io)?
Name the repo exactly `DShamzaj.github.io` instead of `portfolio`. Everything else is identical.

## Edit content
All text, projects, skills, and links live in the `C` object at the top of `src/Portfolio.jsx`.
Colors are the CSS variables in `THEME`. Replace the embedded photo by setting `PHOTO`
to a hosted image URL (or keep the current one).

## Wire up the contact form
The form currently shows a success message locally. To receive submissions, point the
send button at a free form service (Formspree, Web3Forms) or your own API.
