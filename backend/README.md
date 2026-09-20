# Smart Bolashaq backend

NestJS modular monolith with Prisma/PostgreSQL. The application uses GraphQL for CMS and test snapshots, with existing REST URLs retained in `src/modules/public-api`.

See [project setup and commands](../README.md) and [feature contract](../docs/FRAMEWORK-ADOPTION.md). Development runs remotely at `/mnt/sb2dev/sb2/backend`, database port 5437 and API port 3030 on loopback.

```bash
npm run prisma:generate
npm run prisma:deploy
npm run content:import
npm run build
npm run check:framework
```

Build the frontend from the root with `NEXT_DIST_DIR=.next-build npm run build` before running the integration checks. The checks start that production build against their disposable database and verify server-rendered routes, BFF requests and production credential rejection.

Export defaults from the root with `npm run content:export` before importing. `content:import` preserves existing edits and records the legacy import marker. Never run `seed` on a populated database; use `seed:empty` only for an intentionally new empty database.

`src/modules/content` is the first complete framework slice. Other business modules expose queries and use cases; their REST adapters delegate to them and record access is checked in those implementations. The actor is loaded from a verified administrator cookie or a short-lived signed BFF assertion plus current database identity. Client role and organization headers grant no access.

Structured application logs are available through `journalctl -u sb2-dev-api`. Unexpected request errors are captured once at the shared boundary, with safe response text and a request ID. External telemetry collection is not configured.
