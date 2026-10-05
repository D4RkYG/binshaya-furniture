# Bin Shaya'a Furniture

Landing page for **Bin Shaya'a Furniture** (مفروشات بن شائع), a furniture showroom in Farq, Nizwa, Oman.

- English: https://d4rkyg.github.io/binshaya-furniture/
- العربية: https://d4rkyg.github.io/binshaya-furniture/ar/

Plain HTML, CSS and JavaScript, with no build step. GitHub Pages publishes the `docs/` folder from the `main` branch.

## Features

- English and Arabic pages, with the Arabic page laid out right to left
- Light, dark and system themes; the visitor's choice is remembered
- Contact cards with a live "open now / closed" badge (Oman time), WhatsApp contacts, call and email buttons, and a map
- Link previews for WhatsApp and social media, and business details for Google Search
- Responsive images, keyboard-friendly menus, and reduced motion for visitors who ask for it

## Project structure

```
docs/
├── index.html        English page
├── ar/index.html     Arabic page
├── 404.html          "Page not found" page
├── css/style.css     All styles (theme colours are tokens at the top)
├── js/script.js      Menus, theme, scroll effects, opening hours, copy buttons
└── assets/images/    Optimised images (WebP photos, logo, preview images)
image-originals/      Full-size source photos (not committed, see .gitignore)
```

## Working on the site

1. Open the `docs` folder in VS Code and start **Live Server** (Go Live).
2. Edit, check both pages in light and dark mode and at phone width, then commit.

Things to keep in mind:

- **Change both languages.** `index.html` and `ar/index.html` are separate files with the same structure. A change to one usually needs the same change in the other.
- **Opening hours live in two places:** the text in both pages, and the times in `js/script.js` (used for the "open now" badge).
- **`404.html` uses full paths** starting with `/binshaya-furniture/`, because GitHub shows it at any broken address. If the repository is renamed, update those paths and the site address in both pages' `<head>`.
- **New photos:** keep the full-size file in `image-originals/`, and add a 1200px WebP plus a 600px version (800px for the hero) to `docs/assets/images/`.
