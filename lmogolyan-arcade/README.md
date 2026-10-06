# Lmongolyan Arcade

The standalone Next.js portal for the Lmongolyan game collection. It links to
Mangolian Pong and the existing Lmongolyan Kart experience.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3010](http://localhost:3010) with your browser.

Copy `.env.example` to `.env.local` when the games run at different URLs.

## Environment

- `NEXT_PUBLIC_PONG_URL` — Mangolian Pong URL; defaults to `http://localhost:3001`.
- `NEXT_PUBLIC_RACING_URL` — Lmongolyan Kart URL; defaults to `http://localhost:5178`.
