# Smart Bolashaq

Career guidance for students, teacher training and an admin CMS. Next.js lives at the repository root; the NestJS modular monolith lives in `backend/`.

The architecture and feature contract are in [docs/FRAMEWORK-ADOPTION.md](docs/FRAMEWORK-ADOPTION.md). The supplied reusable framework is preserved in [docs/PROJECT-FRAMEWORK.md](docs/PROJECT-FRAMEWORK.md). Future changes follow [AGENTS.md](AGENTS.md).

## Remote development

Edit files locally. The running development app is at **http://136.112.254.16:3025**, with the admin panel at **/admin**. Source, dependencies and the isolated database live on the new disk at `/mnt/sb2dev`.

```powershell
# Local: send current source, or start a lightweight continuous watcher
python -X utf8 scripts/remote-sync.py
./scripts/remote-dev.ps1 watch
./scripts/remote-dev.ps1 status
./scripts/remote-dev.ps1 logs
./scripts/remote-dev.ps1 stop
```

The watcher ignores secrets, runtime data, generated code, dependencies and build outputs. It detects conflicting remote edits and stops that sync instead of overwriting them. First-time setup is for a dedicated checkout; do not point it at an unrelated directory. The desktop app need not run a local development server or database.

```bash
ssh zhumirov@136.112.254.16
cd /mnt/sb2dev/sb2
npm ci --no-audit --no-fund
cd backend && npm ci --no-audit --no-fund && cd ..
npm run content:export
cd backend
npm run prisma:generate
npm run prisma:deploy
npm run content:import
npm run build
cd ..
NEXT_DIST_DIR=.next-build NODE_OPTIONS=--max-old-space-size=1536 npm run build
cd backend && npm run check:framework && cd ..
sudo systemctl restart sb2-dev-api sb2-dev-web
```

Development services: `sb2-dev-db` (loopback 5437), `sb2-dev-api` (loopback 3030), `sb2-dev-web` (3025). Existing live services are separate. Do not run `seed` against an existing database; `seed:empty` explicitly checks that it is empty. `content:import` adds missing defaults and imports the legacy CMS only once; it never replaces existing database edits.

## Feature boundaries

- `backend/src/platform`: Prisma/database, GraphQL limits and shared logging/error handling.
- `backend/src/modules/auth`: JWT verification and password login; feature policies live in their own modules.
- `backend/src/modules/content`: content queries, transactional use cases, policies and GraphQL adapters.
- `backend/src/modules/{tests,profile,navigator,course,chat,achievements}`: separate queries and use cases.
- `backend/src/modules/public-api`: compatibility REST adapters for existing consumers.
- `features/content/graphql`, `features/tests/graphql`: frontend operations; Next route handlers serve as BFF adapters.
- `backend/src/modules/content/domain`: pure document types and validation shared with the frontend through `lib/cms` re-exports.

CMS writes, history, audit and education-program publication commit together. Stale revisions return a conflict. Public queries never return drafts. Test snapshots and answers now live in PostgreSQL, scoped to their authenticated owner. UI capabilities come from backend policies. Preview changes stay within the current page/request.

## Authentication and integrations

Set a strong frontend `AUTH_SECRET`, the same backend `CMS_AUTH_SECRET`, and `ADMIN_PASSWORD` in the remote environment files. The database administrator record can revoke an existing admin cookie. Environment files are intentionally excluded from source sync.

Password login is available at `/login` for students, teachers and administrators. Six test accounts are provisioned explicitly on the isolated VM; private credentials are in `.data/remote-migration/TEST-ACCOUNTS.md` locally and `.data/test-accounts.json` remotely. Teacher login verifies stored scrypt hashes. Student registration retains its development-only shortcut, which cannot enter password-protected accounts; production rejects demo registration. Google OAuth requires real configured credentials. Email delivery, self-service teacher account provisioning, AI responses, verified file uploads and Sentry collection are **not** implemented by this migration. Existing demo dashboards remain labeled demo content. No Redis or broker is needed for this feature's request/response workflow.

## Verification

`backend/npm run check:framework` creates a disposable database on the isolated development cluster, applies migrations and tests real GraphQL/REST requests. It checks permissions, fixed test IDs, four answer types, owner scope, concurrency, idempotent attempts, publication, transaction rollback, imports, revocation and query limits. It drops only its own generated test database after completion.

Development credentials and migration backups are kept outside Git under `.data/remote-migration` locally and `/mnt/sb2dev/backups` remotely. Full database backups must include user records and answers; the admin JSON export intentionally contains content only.

Feature permission and JWT decisions: [docs/AUTHORIZATION.md](docs/AUTHORIZATION.md).
