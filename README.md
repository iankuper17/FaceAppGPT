# FaceScore AI

Web app that analyzes your face and gives a score plus optional glow-up simulation (premium).

## Stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Supabase**: Auth, Postgres, Storage
- **OpenAI GPT-4 Vision**: Face analysis (set `OPENAI_API_KEY`)
- **Nano Banana Pro**: Glow-up image generation (set `NANO_BANANA_PRO_API_KEY`)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In Dashboard > Storage, create two **private** buckets: `selfies`, `results`.
   - In SQL Editor, run the contents of `supabase/seed.sql` in order.

3. **Environment**

   Copy `.env.local.example` to `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (for face analysis)
   - `NANO_BANANA_PRO_API_KEY` (for glow-up; optional for MVP)

   In Supabase Auth settings, add a redirect URL: `http://localhost:3000/auth/callback` (and your production URL when deploying).

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel + GitHub)

1. Push the repo to GitHub.
2. In Vercel, import the repo and add the same env vars.
3. Add your production URL to Supabase Auth redirect URLs (e.g. `https://your-app.vercel.app/auth/callback`).

## Premium & leaderboard

- Set `is_premium = true` (and optionally `premium_until`) on `profiles` for premium users.
- Set `show_in_leaderboard = true` on `profiles` for users who want to appear on the leaderboard.

Beauty is subjective; results are for fun and guidance only.
