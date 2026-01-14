# Parser.ai – AI-Powered Job Discovery Platform

Parser.ai is a polished React + Vite frontend that helps job seekers discover opportunities using AI-powered search, manage applications, prepare for interviews, and showcase their profile. The UI features a modern space-themed dark design with violet accents, responsive layouts, Tailwind-powered design tokens, and clean component architecture that is easy to extend.

---

## ✨ Features
- **Hero Landing Page** – Marketing splash with feature highlights and testimonials.
- **Dashboard View** – Curated job board with static opportunities, spotlight metrics, and weekly agenda.
- **Interactive Profile** – Candidate portfolio layout, timeline, and quick metrics cards.
- **Auth Screens** – Refined login/register forms with alternate providers.
- **Routing Shell** – Shared navbar/footer, guarded routes, and sensible navigation states.

---

## 🛠 Tech Stack
- **React 19** with TypeScript
- **Vite 6** for lightning-fast dev/build
- **React Router 7** for client-side routing
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- Reusable UI primitives (buttons, cards, stats) and mock data providers

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start dev server at http://localhost:3000
npm run dev

# run production build (outputs to dist/)
npm run build
```

> **Tip:** If PowerShell blocks npm scripts, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once.

---

## 📂 Project Structure

```
src/
├── App.tsx              # Route definitions
├── main.tsx             # React root + BrowserRouter
├── components/          # Navbar, Footer, JobCard, etc.
├── data/                # Static job listings + user profile
├── layouts/MainLayout.tsx
├── pages/
│   ├── Landing.tsx      # Marketing splash
│   ├── Home.tsx         # Dashboard view
│   ├── Profile.tsx      # Candidate profile
│   ├── AuthPage.tsx     # Login/Register variant
│   └── NotFound.tsx     # 404 page
└── index.css            # Tailwind entry + global tokens
```

---

## 🧭 Learning Roadmap
1. **Read** `LEARNING_GUIDE.md` – deep dive into React concepts used.
2. **Reference** `QUICK_REFERENCE.md` – copy-friendly snippets and patterns.
3. **Build** using `TASKS.md` – curated exercises from basics to advanced features.
4. **Extend** the mock data or wire a backend when ready.

---

## 🖼 Suggested Screenshots
Capture these views after running `npm run dev`:
- Landing page hero (`/`)
- Dashboard board (`/home`)
- Profile overview (`/profile`)
- Auth dialog (`/login` or `/register`)

Drag PNGs into the repo (e.g., `public/screenshots/landing.png`) and embed:

```
![Landing](public/screenshots/landing.png)
```

---

## 🔧 Customisation Ideas
- Replace demo data in `src/data/jobs.ts` and `src/data/user.ts` with your content.
- Hook up forms to a real API or Supabase/Firebase backend.
- Add dark mode tokens via Tailwind `@theme` custom properties.
- Integrate analytics or feedback widgets on the landing page.

---

## 🤝 Contributing
1. Fork & branch (`git checkout -b feat/new-component`).
2. Keep components atomic and typed.
3. Run `npm run build` to ensure production passes.
4. Submit PR with screenshots and a short summary.

---

## 📄 License
MIT – build on top, remix, and ship your own job tracking experience.