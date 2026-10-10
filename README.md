# Kanga Studio

A browser-based Swahili-inspired kanga pattern generator. Design the patterned centre (mji), decorative border (pindo), and saying (jina), then download your original kanga.

## Features

- Six motifs: Botanical, Rosette, Paisley, Geometric, Sunflower, and Waves.
- Five colour palettes and four individually editable colours.
- Three border styles, adjustable motif size, and adjustable border width.
- Six Swahili sayings with English meanings, or your own message.
- Live previews, an expanded view, and random designs.
- Download PNG images at 3600 × 2400 pixels or editable SVG vectors.
- Save up to 24 designs in your current browser using local storage.
- Responsive layout and keyboard-accessible controls.

## GitHub Pages

The website is ready to publish directly from the repository root. No build or installation is required.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select **main** and **/(root)**, then choose **Save**.
4. Wait for GitHub's Pages deployment to finish.

The site URL after publication is:

https://heed725.github.io/Khanga-Studio/

Later commits to `main` automatically update the website. The `.nojekyll` file tells GitHub Pages to serve the static files directly.

## Run locally

Open `index.html` in a modern browser, or run a local server in this directory:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and controls |
| `style.css` | Responsive styling |
| `app.js` | SVG pattern generation, controls, local saves, and exports |
| `.nojekyll` | Static serving on GitHub Pages |

The app uses no backend, API key, or account. Google Fonts supplies optional web fonts; local fallback fonts work without them. Saved designs remain in the browser and device where you created them. Download SVG or PNG copies for long-term storage or sharing. Exports use 150:100 proportions and do not specify physical fabric dimensions.
