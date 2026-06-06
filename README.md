# Trader Journal

A browser-based trading journal built with React and Vite. It helps track trade ideas, execution notes, risk, confidence, mood, tags, screenshots, and post-trade lessons in one focused dashboard.

## Features

- Create, edit, pin, favorite, and delete journal entries.
- Track symbol, market, direction, status, P&L in INR, risk, confidence, mood, strategy, setup, execution, mistakes, and lessons.
- Use a pre-trade checklist for plan, stop placement, position sizing, and journal completion.
- Filter entries by search text, status, direction, and tag.
- Sort entries by recently updated, trade date, P&L, confidence, or risk.
- View summary stats for total entries, net P&L, win rate, and average P&L.
- Persist data in the browser with `localStorage`.
- Export and import the full journal as JSON.

## Tech Stack

- React 19
- Vite 8
- ESLint 10
- Plain CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Project Structure

```text
src/
  App.jsx                         Main journal interface
  App.css                         App-level styles
  styles.css                      Global styles
  features/
    journal/
      constants.js                Entry defaults, seed data, and option lists
      hooks/
        useJournal.js             Journal state, filters, import/export handlers
      utils.js                    Persistence, stats, sorting, and JSON helpers
  assets/                         App image assets
public/                           Favicons and public icons
```

## Data Storage

Journal entries are stored locally in the browser under the `trader-journal-v1` key. The app seeds a couple of sample entries when no saved journal exists.

Use **Export JSON** before clearing browser data or moving to another browser. Use **Import JSON** to restore a previously exported journal file.
