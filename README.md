# Bin Shaya'a Furniture

Landing page for **Bin Shaya'a Furniture** (مفروشات بن شائع), a furniture showroom in Farq, Nizwa, Oman.

- English: https://binshaya-furniture.onrender.com/
- العربية: https://binshaya-furniture.onrender.com/ar/

Plain HTML, CSS and JavaScript, with no build step. Render publishes the `docs/` folder as a static site, redeploying on every push to `main`.

## Features

- English and Arabic pages, with the Arabic page laid out right to left
- Light, dark and system themes; the visitor's choice is remembered
- An About section with the showroom's numbers (years, clients, sales) that count up each time they scroll into view
- Contact cards with a live "open now / closed" badge (Oman time), WhatsApp contacts, call and email buttons, a map, and the Google rating linking to the reviews
- "Ask on WhatsApp" links on the collection cards that open the WhatsApp contact list, with a message naming the room
- Link previews for WhatsApp and social media, and business details for Google Search
- Responsive images, keyboard-friendly menus, and reduced motion for visitors who ask for it

## Project structure

```
docs/
├── index.html        English page
├── ar/index.html     Arabic page
├── 404.html          "Page not found" page
├── css/style.css     All styles (theme colours are tokens at the top)
├── js/script.js      Menus, theme, scroll effects, count-up, opening hours, copy buttons
└── assets/images/    Optimised images (WebP photos, logo, preview images)
image-originals/      Full-size source photos (not committed, see .gitignore)
```

## Working on the site

1. Open the `docs` folder in VS Code and start **Live Server** (Go Live).
2. Edit, check both pages in light and dark mode and at phone width, then commit.

Things to keep in mind:

- **Change both languages.** `index.html` and `ar/index.html` are separate files with the same structure. A change to one usually needs the same change in the other.
- **Opening hours live in three places:** the text in both pages, the business details (`openingHoursSpecification`) in each page's `<head>`, and the times in `js/script.js` (used for the "open now" badge).
- **WhatsApp links use `api.whatsapp.com/send`, not `wa.me`.** Some networks in Oman can't reach `wa.me`, so the link just keeps loading. The room messages on the collection cards are in each card's `data-whatsapp-message`.
- **The About numbers** (+50 years, +4,000 clients, +19,000 sales) are written once in each page. Change them there; the count-up reads them from the page.
- **The site address** is written in each page's `<head>`: the canonical link, the `hreflang` links, `og:url`, `og:image` and the business details. If the address changes (for example to a new domain), update all of them in both pages.
- **`404.html` uses full paths** starting with `/`, because it is shown at any broken address, however deep.
- **The Google rating** (4.2) under the showroom address is typed in both pages. Update it now and then; the link opens the Google listing.
- **New photos:** keep the full-size file in `image-originals/`, and add a 1200px WebP plus a 600px version (800px for the hero) to `docs/assets/images/`.
