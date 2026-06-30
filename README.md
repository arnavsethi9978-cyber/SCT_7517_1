# PRISM — 3D Scrolling Studio Site

A single-file, dependency-light implementation of a cinematic 3D scrolling website: Three.js scene, GSAP + ScrollTrigger choreography, Lenis smooth scroll, glassmorphism navbar, and an Awwwards-style dark/neon visual system.

## Project structure

```
prism-studio/
└── index.html   ← everything: markup, CSS, and JS in one file
```

Everything is intentionally self-contained (no build step) so it can be opened directly or deployed as a static file. If you'd rather split it up for a larger build, the natural seams are:

```
prism-studio/
├── index.html
├── /css/style.css       ← the <style> block
├── /js/scene.js         ← the Three.js scene (section 10 in the script)
├── /js/interactions.js  ← cursor, magnetic buttons, nav, reveals (sections 1–9)
└── /assets/             ← any real images/fonts you swap in
```

## Running it locally

No build tools required.

```bash
# Option A — just open it
open index.html

# Option B — serve it (recommended, avoids any local file:// quirks)
npx serve .
# or
python3 -m http.server 5500
```

Then visit `http://localhost:5500`.

## What's inside

- **Hero** — full-bleed gradient hero with a Three.js icosahedron "core" plus a 1,700-particle starfield, staged GSAP entrance animation, and a scroll cue.
- **Scroll choreography** — a single `ScrollTrigger` tracks document progress (0→1) and drives camera dolly, core rotation/scale, and particle dispersion every frame — this is the "3D scroll experience."
- **Navbar** — transparent over the hero, switches to a blurred glass panel with a shadow and shrinks in height past 80px of scroll (`.nav.scrolled`). Active section is tracked via per-section `ScrollTrigger`s. Mobile hamburger menu is a full-screen overlay with staggered links.
- **Sections** — About, Features (glass cards with a mouse-tracked light), Work/Portfolio (index-style list), Services (grid), Testimonials (auto-drifting marquee track), Contact.
- **Interactions** — custom dot+ring cursor, magnetic buttons (GSAP `power3`/`elastic` easing), animated counters, scroll progress bar pinned to `<body>` scroll, glass-card pointer-following glow.
- **Accessibility** — `prefers-reduced-motion` disables Lenis, the custom cursor, and magnetic effects; all interactive elements are real `<a>`/`<button>` tags so keyboard and screen-reader navigation works; color contrast was checked against the dark background.

## Performance notes

- Particle count auto-drops from 1,700 → 700 below a 760px viewport.
- `renderer.setPixelRatio` is capped at 2 to avoid melting high-DPI mobile GPUs.
- `gsap.ticker.lagSmoothing(0)` avoids the "catch-up jump" after a tab is backgrounded.
- The Three.js canvas sits behind everything (`z-index:1`) with `pointer-events:none`, so it never steals clicks/scroll.
- Swap `IcosahedronGeometry(2.1, 1)` to a lower detail level (`0`) if you add more geometry later — detail `1` is already the sweet spot for silhouette quality vs. triangle count.
- If you add real images (portfolio thumbnails, team photos), serve WebP/AVIF and add `loading="lazy"` — the markup has no raster images yet by design.

## Suggested real assets (when you move past placeholders)

- **Fonts**: already wired up — Sora (display), Inter (body), JetBrains Mono (labels/data). All loaded from Google Fonts; self-host them for production to avoid a render-blocking third-party request.
- **3D models**: if you want a bespoke shape instead of the procedural icosahedron, export a low-poly `.glb` from Blender and load it with `GLTFLoader` — keep it under ~50k triangles for mobile.
- **Portfolio imagery**: 16:9 stills or short looping `.webm` clips (no audio) work well dropped into `.portfolio-item`.

## Deployment

### Vercel
```bash
npm i -g vercel
vercel --prod
```
Point it at the folder containing `index.html` — no framework preset needed (choose "Other").

### GitHub Pages
1. Push this folder to a repo.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. Site goes live at `https://<username>.github.io/<repo>/`.

Both are zero-config since there's no build step — the file is plain HTML/CSS/JS pulling Three.js, GSAP, and Lenis from CDNs.
