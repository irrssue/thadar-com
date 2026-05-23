# Thadar

An all-in-one EdTech teaching platform. Live at [thadar.com](https://thadar.com).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Auth.js
- **ORM:** Prisma
- **Database:** PostgreSQL (self-hosted, Docker)
- **Storage:** MinIO (self-hosted, S3-compatible)
- **Cache/Sessions:** Redis
- **Email:** Resend
- **Monitoring:** Sentry

## Infrastructure

Self-hosted on a home server cluster (3 Dell nodes, wired Ethernet).

- App, DB, and storage each run in Docker containers
- Network exposed via **Cloudflare Tunnel** → thadar.com
- Backups to Cloudflare R2

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in all required variables before running.

## Environment Variables

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
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
src/
  app/          → Next.js App Router pages and layouts
  components/   → Reusable UI components
  lib/          → Utilities, helpers, shared logic
  server/       → Server-only logic (Prisma client, auth config)
  types/        → Shared TypeScript types and interfaces
prisma/
  schema.prisma → DB schema (single source of truth)
docker/         → Dockerfiles and compose configs
```

## Deployment

Deployed on a self-hosted home server. **Not on Vercel.**

- Docker on all nodes
- Cloudflare Tunnel handles HTTPS and proxying to thadar.com
- No raw file bytes pass through the app server — clients upload directly to MinIO via presigned URLs
