# 2026 World Cup Prediction — Copilot Instructions

See [README.md](../README.md) for project overview, features, and setup commands.

## Build & Run

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Serve dist/ locally
```

No test or lint scripts exist. Bracket logic is complex — manually verify `src/utils/bracketCalc.js` changes.

## Architecture

Linear step-based workflow managed in `App.vue` (no Vue Router):

```
HomeView → GroupsView → ThirdPlaceView → BracketView → SummaryView
```

Navigation uses Vue events (`@start`, `@resume`, `@next`, `@back`, `@reset`, `@make-own`). `App.vue` owns the `step` ref and all route-like coordination.

**Key files:**

| File                       | Role                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `src/stores/prediction.js` | Central Pinia store — all user picks, persistence, URL encode/decode                       |
| `src/utils/bracketCalc.js` | Pure function that resolves group rankings → R32 matchups; propagates picks through rounds |
| `src/data/bracket.js`      | Static structure: match IDs (M73–M103) and pre-determined slot pairings                    |
| `src/data/teams.js`        | 48 teams with `id`, `name`, `iso2` (for flagcdn.com), `group`, `confederation`             |
| `src/utils/share.js`       | LZ-String compression for the `?p=` URL param                                              |
| `src/utils/thirdPlace.js`  | Selects which 8 of 12 third-place teams advance based on user picks                        |

## Conventions

**Vue components:** All use `<script setup>` (Composition API). Props/emits flow upward to `App.vue`.

**Pinia store:** Composition-style — `ref()` for state, `computed()` for derived values, plain functions for actions. Every mutation calls `persist()` which saves to `localStorage` key `wc2026_prediction`.

**Tailwind:** Custom themed colors defined in `tailwind.config.js`: `wc-blue`, `wc-red`, `wc-gold`, `wc-silver`, `wc-dark`, `wc-card`. Dark theme only — no light mode.

**Bracket slot notation:** Slot strings encode team sources:

- `"1A"` → Group A winner
- `"2B"` → Group B runner-up
- `"3ABCDF"` → Best 3rd-place from groups A/B/C/D/F

## Critical Pitfalls

- **Cascade invalidation:** Picking a team in any round clears all downstream picks automatically (reactive `computed`). When editing bracket logic, never bypass reactivity or picks will desync.
- **No TypeScript:** All state is untyped. Be precise with bracket data shapes — malformed team IDs cause silent render failures.
- **URL length:** State is LZ-String compressed into `?p=`. Avoid adding large amounts of uncompressible data to the store.
- **No undo:** Only a full reset is available to the user.
