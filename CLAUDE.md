@AGENTS.md

# Thadar — Claude Code Reference

## Project Overview
Thadar (meaning "generous/giving" in Burmese) is an all-in-one EdTech teaching platform. Initially built for a single student in Myanmar, with plans to expand publicly. Domain: thadar.com

## Tech Stack

### Frontend
- Next.js 15 (App Router only — never Pages Router)
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Route Handlers (App Router convention)
- Auth.js for authentication
- Prisma ORM for all database access

### Infrastructure
- PostgreSQL on a dedicated Dell node (via Docker)
- MinIO (S3-compatible) on a separate Dell node — for video and file storage
- Redis for caching/sessions
- Cloudflare Tunnel → thadar.com
- Docker on all nodes

### External Services
- Resend — transactional email
- Cloudflare R2 — backups
- Sentry — error monitoring

## Architecture Rules (Non-Negotiable)
1. The frontend NEVER connects directly to the database. All data access goes through API Route Handlers.
2. All configuration goes in environment variables. No hardcoded secrets, URLs, or credentials anywhere in the codebase.
3. The app server must remain stateless. No local file storage on the app node.
4. Docker everywhere. Every service runs in a container.
5. Video and file uploads use MinIO presigned URLs. The client uploads directly to MinIO — the app server never handles raw file bytes.
6. Always use the App Router convention. No mixing with Pages Router.
7. Prisma is the only way to talk to PostgreSQL. No raw SQL queries unless there is a documented performance reason.

## Project Structure (follow strictly)
```
src/
  app/          → Next.js App Router pages and layouts
  components/   → Reusable UI components
  lib/          → Utilities, helpers, shared logic
  server/       → Server-only logic (Prisma client, auth config)
  types/        → Shared TypeScript types and interfaces
prisma/
  schema.prisma → Single source of truth for DB schema
public/         → Static assets only
docker/         → Dockerfiles and compose configs
```

## Build Phases
- Phase 0 (current): Cluster prep — Ubuntu Server + Tailscale + Docker + wired Ethernet across 3 laptops
- Phase 1: Foundation — Postgres + MinIO containers, Next.js scaffold, Cloudflare Tunnel to thadar.com, Auth.js login
- Phase 2: Content — DB schema, teacher upload flow, student lesson view
- Phase 3: Progress tracking
- Phase 4: Assignments
- Phase 5: Polish — email notifications, mobile responsive

## MVP Scope
- Content/lesson library (video + text)
- Assignments with progress tracking
- Teacher and student roles
- No native mobile app at MVP — responsive web only

## Code Style
- TypeScript strict mode always on
- No `any` types — use `unknown` and narrow properly
- All async functions use async/await, never raw .then() chains
- Components are functional only — no class components
- All API responses follow this shape:
  ```ts
  { success: boolean, data?: T, error?: string }
  ```

## Git Rules (MANDATORY — follow on every change)
After every meaningful change, Claude Code must:
1. Stage the relevant files
2. Write a commit message following this format exactly:

   ```
   type(scope): short description
   ```

   Types: feat, fix, refactor, chore, docs, style, test
   Scope: the area changed e.g. auth, courses, upload, schema, ui, config

   Examples:
   ```
   feat(auth): add Auth.js credentials provider with session handling
   fix(upload): correct presigned URL expiry for large video files
   chore(docker): add compose config for Postgres and MinIO nodes
   refactor(courses): split course card into smaller sub-components
   docs(claude): update CLAUDE.md with Phase 1 completion notes
   ```

3. Push to the current branch on GitHub immediately after committing. Never batch multiple unrelated changes into one commit.

## Environment Variables (never hardcode these)
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

## What Claude Code Should Never Do
- Never install a new major dependency without explaining why in a comment or commit message
- Never modify the Prisma schema without running `prisma migrate dev` and committing the migration file
- Never commit .env files or any file containing secrets
- Never use `localStorage` or `sessionStorage` for auth state — Auth.js handles sessions
- Never write a frontend component that imports from server/ directly
- Never skip the commit and push step after a change
