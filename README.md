# 🏆 FIFA 2026 World Cup Prediction

A mobile-first web app to predict the FIFA 2026 World Cup — rank all 12 groups, select 3rd-place qualifiers, pick knockout round winners, and share your prediction with a single link.

Live demo: <!-- add your deployment URL here -->

---

## Features

- **Group Stage** — Click teams in order to rank them 1st–4th within each of the 12 groups (A–L)
- **3rd Place Selector** — Choose which 8 of the 12 third-place teams advance
- **Knockout Bracket** — Pick winners from Round of 32 through the Final; choices cascade automatically
- **Shareable URL** — Entire prediction is compressed and encoded in a `?p=` URL parameter — no backend required
- **Saved Locally** — Predictions are persisted in `localStorage` so you can continue later
- **Shared View** — When opening a friend's link, share buttons are hidden and a CTA to start your own prediction is shown

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) + [Vite 5](https://vitejs.dev/) | Frontend framework & build tool |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling |
| [lz-string](https://github.com/pieroxy/lz-string) | URL-safe state compression for sharing |
| [flagcdn.com](https://flagcdn.com/) | Country flag images |

No backend, no database — fully static.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Tournament Format

- **48 teams** across **12 groups** (A–L), 4 teams per group
- Top 2 from each group + best 8 third-place teams advance to **Round of 32**
- Standard single-elimination knockout from R32 → R16 → QF → SF → Final

---

## Project Structure

```
src/
├── components/
│   ├── FlagImg.vue       # Flag image from flagcdn.com
│   ├── GroupCard.vue     # Click-to-rank group UI
│   └── MatchCard.vue     # Knockout match card
├── data/
│   ├── teams.js          # 48 teams with ISO 3166-1 alpha-2 codes
│   └── bracket.js        # R32–Final bracket slot definitions
├── stores/
│   └── prediction.js     # Pinia store (state, localStorage, URL encode/decode)
├── utils/
│   ├── bracketCalc.js    # Computes bracket matchups from picks
│   ├── thirdPlace.js     # Assigns 3rd-place teams to bracket slots
│   └── share.js          # LZString encode/decode + URL builder
└── views/
    ├── HomeView.vue
    ├── GroupsView.vue
    ├── ThirdPlaceView.vue
    ├── BracketView.vue
    └── SummaryView.vue
```

---

## License

MIT
