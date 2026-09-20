# Current verification

See [CMS data-entry release](CMS-RELEASE-VERIFICATION.md) for multilingual editing, recorded test evidence and the latest VM verification.

See [JWT and feature-policy verification](JWT-VERIFICATION.md) for the latest 121 integration assertions, browser checks, deployment evidence and limitations.

The following section records the earlier CMS migration.

# Framework migration verification

Verified on the isolated remote development instance on 2026-09-08.

- Next.js production build and NestJS build passed on the remote host.
- 43 integration assertions cover a disposable PostgreSQL database, real Nest HTTP requests, and the production Next build. Coverage includes access rejection, three fixed tests, four question types, catalog display metadata, concurrency conflicts, audit rollback, program publication, owner isolation, repeat-request deduplication, atomic backup import, administrator revocation, GraphQL cost limits, production SSR, legacy test history, BFF delegation and production demo-login rejection.
- Browser checks confirmed administrator sign-in and the split-pane test, program and teacher-course editors. Temporary question/lesson text edits updated the preview immediately and were discarded.
- Migrated content inventory: 11,630 unique documents, including exactly three tests. The navigator retains 9,268 education program offerings. The pre-framework transfer compared all 38 original database tables by row count. Original source/data backups remain available.
- Development services run from `/mnt/sb2dev`: PostgreSQL on loopback 5437, Nest on loopback 3030, Next on 3025. The existing live app services remain separate.

The compatibility REST adapters remain for existing frontend consumers. CMS editing and saved test snapshots use GraphQL. Demo analytics, AI text and development student registration remain prototype features. Production email/self-service teacher provisioning, verified object uploads and external telemetry collection were not added or claimed as operational.

To reproduce, build the frontend with `NEXT_DIST_DIR=.next-build npm run build`, build the backend, then run `npm run check:framework` inside `backend/` on the development host. The test harness removes only its own generated fixture database and stops its own test processes.
