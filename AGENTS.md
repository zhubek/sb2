# Project instructions

Read `docs/FRAMEWORK-ADOPTION.md` and the supplied architecture reference in `docs/PROJECT-FRAMEWORK.md` before changing feature boundaries. Describe data, processes, policies, queries, frontend operations, realtime and acceptance checks before a new feature.

- Keep Next.js at the root and NestJS in `backend/`. Feature GraphQL adapters belong under `backend/src/modules/<feature>/graphql`; compatibility/external REST adapters belong in `modules/public-api`.
- Controllers/resolvers delegate to queries and use cases. Business modules never import public-api. Prisma belongs in query/use-case implementations; do not add repository wrappers without a reason.
- Derive actors from verified credentials and trusted database state. Authorize records and fields in queries/use cases, before pagination/counts. Never enable demo authentication in production.
- Define transaction, concurrency and retry behavior. Commit related data and audits together. Fixed tests are DeBruce, MBTI and Holland; do not add a create-test flow.
- Keep editor fields on the left and a live preview on the right. Reuse the public display components for teacher courses and navigator previews.
- Every public page-content change must update the matching CMS support in the same change: editable fields and labels, defaults, library category, usage links and preview. Add new content to the CMS and keep changed/removed fields in sync; never leave page text editable only in source. Preserve existing editorial data when schemas/defaults change, and verify the page and admin editor together.
- Keep frontend GraphQL operations with their feature; handle GraphQL errors even with HTTP 200. Derive action capabilities on the server.
- Add no unused Redis, brokers, storage or telemetry placeholders. Log safely once at shared boundaries.
- Local source edits are allowed. Run app development, dependency installation, builds, database operations and tests remotely at `zhumirov@136.112.254.16:/mnt/sb2dev/sb2`. Do not modify existing live services, `/root/sb2`, `/home/bex/sb2`, or the live PostgreSQL cluster.
- Sync source only, preserving remote environment files and runtime data. Report verification and remaining limitations truthfully.
