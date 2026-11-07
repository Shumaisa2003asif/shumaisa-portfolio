# Shumaisa Asif — portfolio

A cinematic, motion-driven personal portfolio built with React 18, Vite, TypeScript, Tailwind CSS 3 and framer-motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

All copy lives in [`src/data/content.ts`](src/data/content.ts): hero note, roles, projects and case studies, journey milestones and interests.
Lines marked `CONFIRM` are drafts (tech stacks, years, society names) that should be checked before publishing.

## Sections

| Section | File |
| --- | --- |
| Hero (Prisma-style cinematic scene) | `src/components/hero/` |
| About | `src/components/About.tsx` |
| Current roles (SaleForgers, TAMx, Mapalz) | `src/components/Now.tsx` |
| Selected work + case studies (`#/work/<slug>`) | `src/components/work/` |
| Journey timeline | `src/components/Journey.tsx` |
| What I explore | `src/components/Explore.tsx` |
| Beyond the screen | `src/components/Beyond.tsx` |
| Contact + footer | `src/components/Contact.tsx` |

## The hero scene

The island, hut, telephone poles and the girl at her laptop are hand-built SVG in `src/components/hero/Island.tsx`.
The golden-hour sky and cloud layers are generated procedurally:

```bash
python scripts/render_hero.py   # needs numpy and Pillow; writes public/hero/*.webp
```

To swap in a photographic or video background instead, replace the layers in `src/components/hero/HeroScene.tsx`.

## Assets

- Company logos and Mapalz screenshots come from saleforgers.com, tamxai.com and mapalz.com.
- `public/images/shumaisa.webp` is used exactly as supplied.
