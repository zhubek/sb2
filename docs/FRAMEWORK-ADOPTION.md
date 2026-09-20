# Framework adoption: Smart Bolashaq

Smart Bolashaq helps students explore careers and education, and gives teachers training materials and school dashboards. Actors are visitors, students, teachers, and content administrators. Existing entities include users/organizations, tests/questions/attempts, courses/lessons/quizzes, institutions/programs, chats and achievements.

The first complete feature is content administration: edit the three predefined tests, teacher courses, navigator records and page content, preview drafts, publish and restore history. Existing URLs and the left-editor/right-preview experience are preserved. The Next.js app stays at the repository root and Nest stays in `backend/`; moving them into `apps/` would add churn without changing the boundaries.

## Content feature contract

- **Data:** PostgreSQL owns content documents, draft/published values, revision history and audit records. Registry defaults are imported only when a document is missing. Existing file content is imported once with a recorded migration marker; subsequent startup never overwrites edits. Fixed registry IDs prevent creating additional tests. Keep 30 history entries per document; audit metadata remains independent of history retention.
- **Processes:** save changes only the draft; publish also changes the public value; restore creates a draft from a retained revision. Each write compares the expected revision and commits content, history, audit and the education-program projection in one database transaction. Stale writes fail with a conflict; no automatic mutation retries. Backup import validates every record and commits all changes or none. A client that loses a response must reload the revision before retrying.
- **Policies:** admin credentials are verified on the server; the enabled administrator record is reloaded from PostgreSQL. Public queries return published values only. Admin queries, history and writes require the content-admin capability. Profile, tests, courses, chat and achievements now own their policies. Only platform ADMIN has cross-user privileges; a content editor has no implicit access to student records. Password credentials and standard JWT verification are described in AUTHORIZATION.md. Development registration remains disabled in production.
- **Queries:** bounded, deterministic document lists; filters precede pagination/counts. No Redis cache initially. SSR loads a request-scoped published snapshot, preventing one user's preview from leaking into another request. Backend/database failure is visible, with no fallback to a writable local file.
- **Frontend operations:** content GraphQL operations live in `features/content/graphql`. Existing Next API URLs are compatibility/BFF adapters; they forward verified cookies and delegate to GraphQL. UI uses server capabilities for editing and publishing.
- **Realtime:** none required. Preview is local component state. Publication is visible on the next request/refetch. There are no subscriptions, brokers or listeners to recover.
- **Files:** content backup JSON is an import/export, not an object upload feature. No storage server is needed for this slice.
- **Observability:** one structured Nest logger and a shared safe error boundary with request IDs. Do not log cookies, tokens, document bodies or student answers. External telemetry collection is not operational until configured and verified.
- **Acceptance:** anonymous access cannot read drafts/write; disabled admin loses access; unknown test IDs are rejected; invalid content leaves all rows unchanged; concurrent saves yield exactly one winner; publish updates navigator data atomically; draft/restore does not change public content; existing content imports without loss; public pages and editor previews render; production builds run remotely.

## Development environment

Local files are the editing source. Install dependencies, generate Prisma, migrate, build, test and run the application on `zhumirov@136.112.254.16` in `/mnt/sb2dev/sb2`. The isolated development database listens on loopback port 5437, backend on loopback 3030, frontend on 3025. Existing live services/checkouts must remain untouched. Secrets, generated files and runtime data are excluded from source synchronization.

## Scope of the transition

The supplied template is a workflow as well as a folder convention. Content administration is migrated end to end first. Existing business features remain usable through explicitly identified compatibility REST adapters while future feature changes receive their own contracts and GraphQL operations. Do not claim that demo dashboards, email delivery, AI responses, uploaded-file verification or external telemetry are production integrations.
