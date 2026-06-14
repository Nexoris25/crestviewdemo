# CrestView — Demo Site for Sales Team

A full-stack lead-generation demo built to the Figma design.

| App | Folder | Stack | Port |
| --- | --- | --- | --- |
| Marketing site | `web/` | Next.js 16 · TypeScript · Tailwind v4 | 3000 |
| Admin dashboard | `dashboard/` | Next.js 16 · TypeScript · Tailwind v4 | 3002 |
| API + AI | `backend/` | NestJS 11 · Prisma · SQLite · Google Gemini | 3001 |

Fonts: **Playfair Display** (headings) + **Poppins** (body), self-hosted. Brand: navy `#04092F`, orange `#D67105`.

## How it works

1. A visitor submits the **contact form** (or chats with the **AI Assistant**) on the marketing site.
2. The NestJS backend stores the lead and asks **Google Gemini** to analyse it — summary, lead score (0–100), Hot/Warm/Cold status, "why this score" reasons, tone signals, a recommended next step, and a draft follow-up email.
3. The lead appears in the **admin dashboard** (Overview + Leads) with full AI insights and a regenerate-able email.

If `GEMINI_API_KEY` is not set, the backend falls back to a deterministic rule-based analyzer so everything still works.

## Run it

```bash
# 1. Backend  (http://localhost:3001/api)
cd backend
npm install
npx prisma db push        # create the SQLite database
npm run seed              # optional: demo leads
# add your key to backend/.env  ->  GEMINI_API_KEY=...
npm run start             # or: npm run start:dev

# 2. Marketing site  (http://localhost:3000)
cd web
npm install
npm run dev

# 3. Admin dashboard  (http://localhost:3002)
cd dashboard
npm install
npm run dev
```

Admin login (configurable in `backend/.env`): `admin@crestviewgroup.com` / `crestview123`.

## Environment

- `web/.env.local` & `dashboard/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- `backend/.env` → `GEMINI_API_KEY`, `GEMINI_MODEL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `DATABASE_URL`, `CORS_ORIGINS`
