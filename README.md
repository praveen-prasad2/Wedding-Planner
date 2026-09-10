# Wedding Planner

A mobile-first web app for tracking wedding expenses and to-dos, category by category — auditorium, catering, decor, dress, jewelry, and more.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- MongoDB + Mongoose
- Tailwind CSS v4
- Auth.js (NextAuth v5) with a credentials (email/password) provider

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in:

   - `MONGODB_URI` — connection string for a MongoDB instance (local install, Docker, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
   - `AUTH_SECRET` — a random secret used to sign sessions. Generate one with:

     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), which redirects to `/login`. There's no public signup page — accounts are created directly in the database (see below). The first login auto-seeds the 10 default wedding categories for that user.

## Creating a login

There's no signup page by design (single-family app). To create or update a login, hash a password with bcrypt and insert a `User` document directly, e.g. via a short one-off Node script that connects with `MONGODB_URI` from `.env.local`, hashes the password with `bcryptjs`, and creates the user document (`name`, `email`, `passwordHash`).

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/components` — client/UI components
- `src/models` — Mongoose schemas (`User`, `Category`, `Expense`)
- `src/lib` — DB connection, auth config, server-side data helpers
- `src/proxy.ts` — route protection (redirects unauthenticated users to `/login`)

## Notes

- Currency is formatted as Indian Rupees (₹).
- All API routes validate the session server-side; unauthenticated API calls return 401.
