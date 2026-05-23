# Thadar

All-in-one EdTech teaching platform. Live at [thadar.com](https://thadar.com).

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Auth:** Auth.js v5 (NextAuth) — Credentials provider, JWT sessions, bcrypt
- **ORM:** Prisma 7 with `@prisma/adapter-pg` driver adapter
- **Database:** PostgreSQL 16 (self-hosted, Docker)
- **Storage:** MinIO (planned, S3-compatible)
- **Cache/Sessions:** Redis (planned)
- **Email:** Resend (planned)
- **Monitoring:** Sentry (planned)

## Infrastructure

Self-hosted on home server cluster.

- App, DB, storage each in Docker containers
- Postgres bound to `127.0.0.1:5433` + Tailscale `100.100.200.29:5433` on homelab
- Public access via **Cloudflare Tunnel** → thadar.com → `localhost:3001` (PM2-managed)
- Deploys via GitHub Actions over Cloudflare-tunneled SSH
- Backups to Cloudflare R2 (planned)

## Development

```bash
npm install
cp .env.example .env
# fill DATABASE_URL, AUTH_SECRET (openssl rand -base64 32)
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Local dev hits homelab Postgres over Tailscale — `DATABASE_URL` points at `homelab:5433`.

## Environment Variables

```
DATABASE_URL          # postgresql://thadar:PASSWORD@host:5433/thadar?schema=public
AUTH_SECRET           # openssl rand -base64 32
AUTH_URL              # http://localhost:3000 in dev, https://thadar.com in prod
AUTH_TRUST_HOST       # true (Cloudflare Tunnel proxies the request)
```

Planned (later phases):

```
MINIO_ENDPOINT
MINIO_ACCESS_KEY
MINIO_SECRET_KEY
MINIO_BUCKET_NAME
REDIS_URL
RESEND_API_KEY
SENTRY_DSN
```

## Project Structure

```
app/              → Next.js App Router pages, layouts, API routes
  api/auth/       → Auth.js handler + register endpoint
  login/          → Login + register UI
components/       → Reusable UI components (inside app/ for now)
server/           → Server-only logic (Prisma client, Auth.js config)
  db.ts           → PrismaClient singleton with pg driver adapter
  auth.ts         → Auth.js v5 config (Credentials, JWT, role-aware session)
prisma/
  schema.prisma   → DB schema (single source of truth)
  migrations/     → Migration history
proxy.ts          → Route protection (Next 16 renamed Middleware)
auth.config.ts    → Edge-safe Auth.js config used by proxy.ts
prisma.config.ts  → Prisma 7 config (datasource URL lives here, not in schema)
```

## Database

Postgres runs in `~/docker/thadar-postgres/` on homelab:

```bash
ssh irrssue@homelab
cd ~/docker/thadar-postgres
docker compose ps
```

Apply schema changes:

```bash
# locally
npx prisma migrate dev --name <change>
git push origin main   # deploy.yml runs migrate deploy on homelab
```

## Auth

- `POST /api/auth/register` → `{ name, email, password }`, returns `{ success, data: { id, email, name, role } }`
- `POST /api/auth/callback/credentials` (Auth.js standard) → sets JWT cookie
- `GET  /api/auth/session` → current session w/ `user.id` and `user.role`
- `proxy.ts` protects `/home`, `/classes`, `/profile`, `/inbox` — unauthed requests redirect to `/login?callbackUrl=...`

Roles: `STUDENT` (default), `TEACHER`, `ADMIN`.

## Deployment

Push to `main` → GitHub Actions:

1. Installs `cloudflared`
2. Loads SSH key + known_hosts from secrets
3. SSH to homelab via Cloudflare Tunnel
4. `git pull`, `npm ci`, `prisma generate`, `prisma migrate deploy`, `npm run build`, `pm2 restart thadar`

`.env` lives on homelab at `~/thadar.com/.env` (chmod 600), never committed.

## Rules

- Frontend never connects to DB directly — only through API routes
- All secrets in env vars
- App server stateless — files upload directly to MinIO via presigned URLs
- App Router only (no Pages Router)
- Prisma only (no raw SQL without documented reason)
- Atomic commits, push to `main` after every meaningful change
