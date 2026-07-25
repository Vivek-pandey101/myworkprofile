# Vivek Pandey — Portfolio

A premium, responsive personal portfolio for **Vivek Pandey**, Full Stack Developer.
Built with a modern SaaS design language (dark theme, glassmorphism, subtle motion)
inspired by Linear, Stripe, and Vercel.

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, config in `src/index.css` `@theme`)
- **Framer Motion** — entrance, scroll-triggered, and hover animations
- **react-icons** — brand & UI icons

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start dev server (http://localhost:5173)
npm run build   # production build → dist/
npm run preview # preview the production build
npm run lint    # eslint
```

## Structure

```
src/
├─ App.jsx                 # page assembly + scroll progress bar
├─ index.css               # Tailwind import, design tokens, keyframes
├─ data/
│  └─ content.js           # single source of truth for all copy/data
└─ components/
   ├─ ui/
   │  ├─ motion.js         # shared Framer Motion variants
   │  ├─ Section.jsx       # section shell + animated heading
   │  ├─ Button.jsx        # reusable button/link with micro-interactions
   │  └─ Background.jsx    # ambient gradient + grid + animated blobs
   ├─ Navbar.jsx           # sticky glass nav + mobile menu
   ├─ Hero.jsx
   ├─ About.jsx
   ├─ Skills.jsx
   ├─ Experience.jsx       # timeline
   ├─ Projects.jsx         # featured project showcase
   ├─ Achievements.jsx     # animated count-up stats
   ├─ Contact.jsx          # validated contact form
   └─ Footer.jsx
```

## Customizing

- **All content** (name, links, skills, projects, stats) lives in
  [`src/data/content.js`](src/data/content.js) — edit there, no component changes needed.
- **Colors / fonts** are design tokens in the `@theme` block of
  [`src/index.css`](src/index.css).
- The contact form has no backend; on submit it opens the visitor's mail client
  with a prefilled draft. Swap `handleSubmit` in `Contact.jsx` for an API call if
  you add a backend.
- Update the `github`, `linkedin` URLs and the profile image in the hero as needed.

## Notes

- Fully responsive (mobile → desktop), SEO meta tags in `index.html`,
  accessible labels/ARIA on interactive elements, and `prefers-reduced-motion` respected.
