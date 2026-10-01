# Ayush Raj — Portfolio

An interactive portfolio for my engineering work, products, and current direction. Visitors enter through a continuous space flight, then travel between sections using a scroll-linked rocket and station rail.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To check the production build, run `npm run lint` and `npm run build`.

## Built with

Next.js, React, TypeScript, Framer Motion, CSS, and Canvas. The page includes a reduced-motion path for visitors who prefer less animation.

## Project structure

- `src/app/` — page and styles
- `src/components/` — sections, flight, navigation, and visual elements
- `src/data/` — journey stops and project content
- `src/lib/` — procedural Earth and planet rendering
- `public/flight/SOURCE.md` — imagery credits and details
