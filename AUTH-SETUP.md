# Turning on real accounts (signup + login)

The code is built and deployed. Accounts stay **off** (the site shows an honest
"accounts not enabled yet" message) until you connect a database. One-time setup,
~5 minutes, all free tier. **You don't need to touch any code.**

## 1. Create a Postgres database in Vercel (free)
1. Vercel dashboard → your **newvenuedata** project → **Storage** tab → **Create Database**.
2. Choose **Postgres** (Neon-backed) → pick the free/hobby plan → **Create**.
3. When prompted, **Connect** it to the project. Vercel automatically adds the
   `POSTGRES_URL` (and related) environment variables to the project — that's the
   only env var the auth system needs. (Sessions are opaque DB-stored tokens, so
   there is no extra auth secret to set.)

## 2. Redeploy
Adding the database triggers a redeploy automatically. If not, **Deployments →
Redeploy** the latest. On the first signup, the app creates its tables
automatically (`users`, `sessions`, `api_keys`) — no migration step.

## 3. Test it (2 minutes)
1. Go to **newvenuedata.com/signup** → create an account → you'll get a **real
   API key** shown once. Copy it.
2. Hit the API with it:
   ```bash
   curl https://newvenuedata.com/api/licenses?limit=3 \
     -H "Authorization: Bearer <your_key>"
   ```
   You should get data with `X-RateLimit-*` headers (your plan's limit, not the demo tier).
3. **Sign out**, then **Sign in** again at /login → you land on **/account**, where
   you can see your plan and **rotate** your key.

## What's built vs. not (honest)
- ✅ Email + password signup/login, scrypt-hashed passwords, DB-backed sessions
  (httpOnly cookie), real per-user API keys that authenticate against the API,
  an `/account` page (plan + key rotate + sign out).
- ⛔ Not yet: email verification, password **reset** (it currently points people
  to email you), team seats, and tying the plan to a paid Stripe subscription
  (signup defaults everyone to `trial`). These are the next steps once you have
  paying users — each needs a small addition (Resend for email; a Stripe webhook
  to set `plan`).

## Local development (optional)
To run auth locally, put a Postgres URL in `licensesignal/.env.local`:
```
POSTGRES_URL="postgres://…"
```
(e.g. `vercel env pull .env.local` after step 1, or a free Neon dev branch.) Without
it, the app runs exactly as production-without-a-DB: pages load, accounts are "not
enabled."
