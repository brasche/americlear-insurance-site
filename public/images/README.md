# Photo slots

The site ships with no photography and is designed to look complete without it. Two styled containers are reserved for licensed photos you add later. Only use photos you own or have licensed; do not hotlink stock images.

| Slot | File in `src/` | Suggested subject | Recommended size |
|---|---|---|---|
| Home hero side panel | `src/pages/index.astro` (comment: "Image slot: home hero") | A calm, well-lit portrait of the agent or a multi-generational family; warm neutral tones that sit well against navy | 1200 × 1500 px (4:5), JPG or WebP, under 250 KB |
| About page | `src/pages/about.astro` (comment: "Image slot: about page") | Office exterior in Costa Mesa, or the agent at a desk with a client | 1200 × 900 px (4:3), JPG or WebP, under 250 KB |

## How to add a photo

1. Save the file here, e.g. `public/images/hero.jpg`.
2. In the page file, replace the placeholder `<div ... aria-hidden="true">...</div>` with:

```html
<img src="/images/hero.jpg" alt="Describe the photo for screen readers" width="1200" height="1500" loading="lazy" class="w-full rounded-sm border border-gold/40 object-cover" />
```

3. Keep the `alt` text meaningful. Leave `loading="lazy"` off the hero image if it is above the fold.
4. Commit and push; the site redeploys automatically.
