# Reusable project template for coding agents

Paste this entire document into a new agent session, followed by your project idea or requested change. It is self-contained: no previous conversation, existing source code, or companion documentation is required.

## Instructions to the agent

Use this document as the default architecture and development workflow. The user's explicit project requirements take precedence. Preserve existing project conventions unless a change is necessary and explain material departures from this template.

Begin by identifying the project's purpose, actors, entities and first complete feature. Make reasonable implementation choices and state assumptions. Ask only for missing decisions that materially affect business behavior, permissions, external commitments or irreversible actions. Do not require the user to fill every placeholder before you can make useful progress.

Before implementing a feature, describe its data, processes, policies, queries, frontend operations, realtime contract and acceptance checks at a level proportional to its complexity. Keep these decisions reviewable. Do not create unused folders, placeholder integrations, extra brokers or microservices merely to match the sample tree.

For each completed change, explain what changed, where the important logic lives, what was verified and which limitations remain. Never claim authentication, durability, logging collection or an external integration is operational without implementing and checking it.

## Project conventions

Apply these conventions while implementing the requested project.

- Read this template and the agreed feature requirements before changing feature boundaries.
- Use a Next.js frontend and a NestJS modular monolith. Keep GraphQL adapters inside business modules and external REST adapters in public-api.
- Resolvers/controllers delegate to exported queries and use cases. Public API controllers do not access Prisma or duplicate business logic.
- Business modules never depend on public-api. Keep cross-module orchestration and its transaction owner explicit.
- Name business processes use-cases; mutation refers to a GraphQL entry point.
- Use Prisma directly in query/use-case implementations. Add a repository abstraction only for a documented need.
- Preserve organization, record and field access boundaries before pagination, counts, caching and notifications.
- Build actors from verified credentials. Never trust demo headers or client-supplied organization identity in production.
- Policies never import guards. Use cases enforce record authorization for every caller. Derive UI capabilities from policies and domain rules.
- Define transaction, concurrency, retry/idempotency and failure behavior before implementing writes.
- Publish transient events and invalidate caches after commit. Use an outbox only when durable side effects are required.
- Redis connection/cache helpers live together under platform/redis. Cache selected queries with explicit scope, TTL, invalidation and outage behavior.
- Define realtime trigger, recipients, payload, lifecycle and recovery. Clean up listeners; refetch on reconnect and handle permission changes.
- Keep frontend GraphQL operations with the feature. Use server capabilities for action availability.
- Keep file metadata/access in the files feature and object operations in platform/storage. Verify uploads before marking them ready.
- Configure structured logging once. Capture unexpected errors once at a shared boundary; return safe errors and exclude sensitive telemetry.
- Add only dependencies and abstractions justified by the feature contract. No default brokers or new microservices.
- Run relevant behavior tests and production builds. Report results and unresolved risks truthfully; do not claim authentication, durability, or integrations that are not implemented.

### Project-specific commands — discover or define during setup

- Install:
- Start infrastructure:
- Generate client / migrate database:
- Start application:
- Unit / integration tests:
- Production build:
- Dependency audit:


---

## Purpose, stack and workflow

Use these conventions as the default architecture for the project described by the user. Not every application needs every optional folder or service.

**Goal:** understand the important decisions, give a coding agent clear requirements, and know where to investigate when behavior is wrong.

Everything required to use this template is included below: architecture rules, a feature specification form, a worked example, and agent instructions.

### What you control

| Contract | Decisions you own |
| --- | --- |
| ERD | Entities, relationships, ownership, constraints, indexes, retention |
| Processes / use cases | Inputs, state changes, transaction boundaries, concurrency, retries, failures |
| Policies | Allowed actors, record/field scope, integration scopes, revocation |
| Queries | Filtering, pagination, aggregation, access scope, cache behavior |
| Frontend GraphQL operations | What each screen reads, changes, or subscribes to |
| Realtime | Triggers, recipients, payloads, lifecycle, missed-update recovery |
| Acceptance checks | Evidence that success, rejection, concurrency, and recovery work |

You can delegate implementation details. Review these contracts and the evidence that the code follows them. Production errors in Sentry supplement tests and review; they do not replace them.

### Default stack

- Next.js frontend and NestJS modular monolith backend.
- GraphQL inside business feature modules, assembled into one schema/endpoint.
- A separate `public-api` module for external REST integrations when needed.
- PostgreSQL through Prisma for durable business data.
- Redis integration for selected caches and cross-instance Pub/Sub.
- MinIO / S3-compatible storage for files when the project has uploads.
- Sentry for frontend/backend unexpected errors, plus structured backend logs.

No default RabbitMQ, Kafka, extra business microservices, or repository wrappers around Prisma. Introduce additional tools only for a written requirement. Sentry and MinIO are infrastructure deployments, not business modules; self-hosted Sentry has multiple dependencies of its own.

### Workflow for a new project

1. Describe users, organizations and their main actions.
2. Draw the ERD and write invariants before generating CRUD.
3. Write one feature specification, including denied actions and failure behavior.
4. Implement a vertical slice: data → policy → query/use case → GraphQL → UI → checks.
5. Add caches and realtime only with explicit behavior and recovery contracts.
6. Add public REST adapters for actual integration consumers.
7. Before deployment, verify real authentication, migrations, restore procedures, observability, and dependencies.

Repeat by feature. Do not generate a large empty folder tree before the first slice works.

---

## Architecture and responsibilities

### 1. File structure

Create optional folders when a real feature needs them. File names below are conventions, not framework-mandated names. Choose compatible package versions and verify integration bootstrap against their documentation at project setup time.

```text
project/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       ├── instrument.ts                 # Sentry initialization
│   │       ├── platform/
│   │       │   ├── database/
│   │       │   │   ├── database.module.ts
│   │       │   │   └── prisma.service.ts
│   │       │   ├── redis/
│   │       │   │   ├── redis.module.ts
│   │       │   │   ├── redis.service.ts       # Connection, cache operations
│   │       │   │   └── pubsub.service.ts      # When realtime needs it
│   │       │   ├── storage/
│   │       │   │   ├── storage.module.ts
│   │       │   │   └── storage.service.ts     # MinIO/S3 operations
│   │       │   ├── graphql/
│   │       │   │   ├── graphql.config.ts
│   │       │   │   └── error-handler.ts
│   │       │   ├── logging/
│   │       │   │   └── logger.ts
│   │       │   └── config/
│   │       │       └── env.ts
│   │       └── modules/
│   │           ├── auth/
│   │           │   ├── auth.module.ts
│   │           │   ├── actor.type.ts
│   │           │   ├── actor-context.service.ts
│   │           │   ├── guards/
│   │           │   │   └── authentication.guard.ts
│   │           │   └── decorators/
│   │           │       └── current-actor.decorator.ts
│   │           ├── assignments/
│   │           │   ├── assignments.module.ts
│   │           │   ├── graphql/
│   │           │   │   ├── assignments.resolver.ts
│   │           │   │   ├── assignment-fields.resolver.ts
│   │           │   │   ├── inputs/
│   │           │   │   │   └── create-assignment.input.ts
│   │           │   │   └── types/
│   │           │   │       ├── assignment.type.ts
│   │           │   │       └── assignment-capabilities.type.ts
│   │           │   ├── queries/
│   │           │   │   ├── list-assignments.ts
│   │           │   │   └── count-assignments.ts
│   │           │   ├── use-cases/
│   │           │   │   ├── create-assignment.ts
│   │           │   │   ├── complete-assignment.ts
│   │           │   │   └── complete-assignment.spec.ts
│   │           │   ├── policies/
│   │           │   │   └── assignment.policy.ts
│   │           │   ├── domain/
│   │           │   │   └── assignment.rules.ts
│   │           │   ├── guards/               # Optional early feature checks
│   │           │   ├── cache/                # Optional shared feature cache rules
│   │           │   ├── loaders/              # Optional batched relation reads
│   │           │   └── realtime/
│   │           │       └── assignments.subscription.ts
│   │           ├── projects/                 # Same feature conventions
│   │           ├── files/                    # Metadata, permissions, upload processes
│   │           └── public-api/               # Optional external REST interface
│   │               ├── public-api.module.ts
│   │               ├── guards/
│   │               │   └── api-key.guard.ts
│   │               └── v1/
│   │                   └── assignments/
│   │                       ├── assignments.controller.ts
│   │                       ├── inputs/
│   │                       └── responses/
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── layout.tsx
│           │   ├── error.tsx
│           │   ├── global-error.tsx
│           │   └── assignments/
│           │       ├── page.tsx
│           │       └── loading.tsx
│           ├── features/
│           │   └── assignments/
│           │       ├── components/
│           │       ├── graphql/
│           │       │   └── assignments.operations.ts
│           │       └── hooks/
│           │           └── use-assignment-updates.ts
│           ├── components/ui/
│           ├── lib/graphql/
│           │   ├── client.ts
│           │   └── provider.tsx
│           ├── generated/graphql.ts          # If code generation is configured
│           ├── instrumentation.ts
│           └── instrumentation-client.ts
├── infra/
│   ├── compose.yaml
│   ├── nginx/
│   ├── postgresql/
│   ├── redis/
│   ├── minio/
│   └── sentry/
├── docs/
│   └── PROJECT-TEMPLATE.md                   # This self-contained reference
├── AGENTS.md
├── .env.example
└── README.md
```

Use either operation strings in `.operations.ts` or `.graphql` documents with tooling; do not maintain duplicate definitions. Inputs are GraphQL DTOs; a duplicate backend `dto/` folder is unnecessary. Public REST DTOs can differ because they are a separate versioned contract.

### 2. Dependency rules

```text
Feature GraphQL resolver ──┐
Public REST controller ────┼──→ Feature query/use case → Policy/domain → Prisma
Job or message consumer ──┘
```

- A module wires providers and exports the queries/use cases other modules may call.
- Resolvers/controllers adapt inputs, actor context, and responses. They do not own business transactions.
- Queries perform scoped reads and use Prisma directly. Use cases orchestrate writes and business rules.
- Policies evaluate authorization. Domain rules evaluate state and business invariants.
- Shared infrastructure implements technical connections. Business modules do not import `public-api`.
- Cross-feature work uses exported operations; avoid reaching into another feature's private implementation.
- A workflow spanning features has one clear owner. If it must be atomic, coordinate one transaction and pass its transaction client to internal operations. Independently committed use cases do not become atomic just because another function calls them together.

The word **mutation** identifies a GraphQL entry point. **Use case** identifies the business process it calls. Keep `use-cases/`; do not rename it `mutations/` or also add `processes/` for the same purpose.

### 3. ERD and durable data

For every entity define identity, organization/ownership, relationships, required fields, uniqueness, allowed states, deletion behavior and useful indexes. Enforce essential invariants with database constraints, not only UI checks. Consider whether tenant-bound relationships need composite constraints to prevent cross-tenant associations.

PostgreSQL is authoritative for business state. Redis is not the only copy of an assignment or permission grant. MinIO holds file bytes; PostgreSQL holds file metadata and access relationships.

Migrations belong in version control. Describe data backfills and compatibility when changing a schema used by deployed clients. Maintain and test backup/restore procedures for database data and object storage.

### 4. Authentication, guards and policies

Authentication determines the principal. Authorization determines what that principal may do. A shared actor contract can represent either a person or an integration:

```ts
type Actor = {
  kind: 'user' | 'integration';
  principalId: string;
  organizationId: string;
  permissions: readonly string[];
};
```

The actor is built from verified credentials and trusted server data, never from an arbitrary client organization ID. A session guard and an API-key/OAuth guard can produce this same shape. Guard implementations may differ by authentication method and by how HTTP/GraphQL/WebSocket requests expose credentials.

Policies never depend on guards. Optional feature guards call policies for early actor-level rejection. Use cases recheck record-level access after loading the record, including calls from jobs and public REST endpoints. Queries apply access scope before pagination, counts and aggregation. Field-level restrictions require explicit filtering/resolution; hiding a field in the UI is insufficient.

Integration scopes limit the credential's authority. When acting on behalf of a user, combine credential scope with that user's allowed actions rather than widening either. Specify token/session expiry and grant-revocation behavior. Cached grants and JWT claims have freshness limits; document them.

Permissions are one part of security. Credential verification, input limits, upload validation, secret handling and deployment boundaries have their own implementation checks.

### 5. UI capabilities

The backend combines policy and state decisions into simple capabilities:

```json
{
  "canComplete": false,
  "completeReason": "This assignment is already completed."
}
```

Use `null` as the reason when permitted. State information in a reason must itself be safe to disclose. Apply readable-data filtering before deriving capabilities.

Compute capabilities in a GraphQL field resolver when they should run only if requested. For a list, load the actor once, batch any related authorization facts, then evaluate rows without a database/Redis call per row. Mutation authorization remains authoritative even if the UI capability was true moments earlier.

### 6. Queries and GraphQL operations

Every query defines access scope, filters, deterministic ordering, page limits, response shape, and caching behavior. The frontend operation selects fields from the backend schema; it cannot invent fields or bypass policies.

```graphql
query AssignmentScreen($id: ID!) {
  assignment(id: $id) {
    id
    title
    capabilities { canComplete completeReason }
  }
}
```

This is an illustrative contract, not a claim that the demo exposes this exact query. A query named `AssignmentScreen` is a client-chosen operation name; `assignment` is the backend field.

GraphQL field selection reduces the response payload, but does not automatically reduce Prisma reads. Avoid eagerly loading relations or capabilities that the client did not request. Batch relation reads where needed to avoid N+1 queries.

If exposing `{ totalCount, nodes, pageInfo }`, count and rows must use the same access/filter rules. `totalCount` normally counts all matching readable rows before pagination. Separate field resolvers can avoid loading rows for a count-only request. Document snapshot consistency if separate reads must agree during concurrent writes.

Define limits for expensive nested queries as well as top-level page size. REST and GraphQL clients should receive explicit public response shapes rather than raw database records.

### 7. Processes, transactions and failures

A use case owns: validated business input, current-state reads, policy decisions, state rules, writes, transaction boundaries, concurrency behavior, returned result and post-commit actions.

Save related state and required activity/audit entries in one database transaction. A transaction alone does not prevent all races: use a version/state condition, lock, isolation strategy or uniqueness constraint suited to the invariant. Keep remote network calls outside long-running database transactions. Prisma documents transactions, idempotency and optimistic concurrency as distinct tools. [Prisma transaction guide](https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions)

For each operation decide what happens if the caller retries or times out after a successful commit. An idempotency key should be scoped to the principal/tenant and operation; reject reuse with a different payload. Do not blindly retry a non-idempotent external side effect.

Publish transient notifications and invalidate caches after commit. If a notification must survive a crash, store an outbox entry with the transaction and deliver it using a retrying worker. Delivery may repeat; consumers must deduplicate or be idempotent. An outbox does not require RabbitMQ and is not mandatory for disposable UI updates.

### 8. Redis caching

Use `platform/redis/` for connections and generic get/set/delete/TTL operations. There is no mandatory separate `platform/cache/`. Extract a feature cache helper only when keys/invalidation rules are shared or becoming complex.

For each cached query record:

- What is cached and why it saves meaningful work.
- Key composition: tenant, access scope, filters, sorting/page, schema version as applicable.
- TTL and acceptable staleness.
- Writes that invalidate it, including imports, admin scripts and external writers.
- Redis outage behavior, concurrent refresh behavior and whether stampede protection is needed.

Cache-aside reads check Redis, compute on a miss and store with a TTL. Cache failures may fall back to PostgreSQL. Authorization-cache failures need an explicit safe behavior, never unconditional access.

Invalidation can race with an in-flight read that later writes stale data. A generation token or versioned key can prevent that result being used by future reads. Generation replacement must avoid old-key reuse after eviction. Even then, database/cache updates are not a single atomic transaction; specify the remaining staleness window.

### 9. Realtime contract and lifecycle

Control six things: trigger, recipients, payload, subscription lifetime, frontend action, and recovery.

```text
Committed use case → shared publisher → Redis Pub/Sub
                                      ↓
                          Each backend instance
                                      ↓
                       Authorized GraphQL subscribers
                                      ↓
                         Frontend refresh / patch
```

Use cases decide when a change exists. Feature subscription resolvers validate subscription scope and select recipients. The shared publisher owns transport connections. Frontend operation documents define the requested subscription; hooks manage its lifetime and reaction.

One WebSocket connection can carry multiple subscriptions. Start subscriptions when needed, stop them on unmount or identity change, and keep the connection implementation shared. Nest documents GraphQL subscription setup and WebSocket authentication separately from ordinary HTTP context. [NestJS subscriptions](https://docs.nestjs.com/graphql/subscriptions)

For authorization, check both initial subscription access and how permissions change while it remains open. Define revalidation or forced unsubscribe/disconnect on revocation. Tenant-wide events are only suitable if every subscriber may know the affected entity exists. Otherwise filter recipients more narrowly. A later authorized refetch does not undo leaked event metadata.

Prefer small change notifications and authorized refetches for a first implementation. For pushed records, filter fields for the recipient and include a version/sequence strategy to handle duplicate or out-of-order updates. Membership and sort changes may require refreshing a list even if one row can be patched.

Establish the stream before the initial snapshot, with an application-level readiness handshake or equivalent sequencing; a connected socket alone does not prove a subscription is installed. Refetch after reconnect. Batch rapid notifications and allow at most one refresh in flight with a pending-refresh flag. Unsubscribe cleanly to release listeners.

Redis Pub/Sub is at-most-once and has no replay for disconnected subscribers. Durable work requires another design. [Redis Pub/Sub semantics](https://redis.io/docs/latest/develop/pubsub/)

GraphQL subscriptions over WebSockets are the default here. SSE is an alternative transport for server-to-client events; confirm client/server protocol support. Do not add a second event stack simply because another module needs realtime.

### 10. Public REST API

Keep GraphQL resolvers inside business modules and external REST controllers in `modules/public-api/`. There is still one NestJS deployment. `PublicApiModule` imports the business modules; business modules never import it.

Public controllers call exported queries/use cases and map responses. They do not query Prisma directly or duplicate policies. The public interface owns credential guards, API scopes, validation DTOs, versioned contracts, documentation, rate limits and error mapping. Business idempotency/concurrency guarantees belong to the shared operation.

For example, `POST /api/v1/assignments/:id/complete` and GraphQL `completeAssignment` call the same use case. There is no requirement to expose every internal operation publicly or through both transports. Incoming webhooks need their provider-specific signature and replay verification before invoking business operations.

### 11. Files and MinIO

`platform/storage` implements object operations; the `files` feature owns metadata, access and upload/download processes. Keep buckets private by default. The backend authorizes access and may issue short-lived signed URLs to allow direct browser transfers.

Define an upload workflow: authorize → create pending metadata/object key → upload → verify object size/type and required scanning → mark ready. Do not trust client confirmation alone. Database transactions cannot atomically commit an object-storage operation; describe compensation, orphan cleanup, and retry behavior. Authorize again before issuing download URLs.

Distinguish application storage-operation logs from MinIO operational logs and audit events. Configure collection, retention and access in `infra/minio/`; calling the storage service logger does not collect MinIO's own logs. Avoid logging signed URLs or sensitive object names.

### 12. Errors and logging

Configure a structured logger once. Log useful outcomes and failures with operation, timestamp, severity, and request/trace ID. Do not create a logging module/service/interceptor trio unless it provides a concrete benefit. Infrastructure configuration controls how stdout logs are collected and retained.

Use Sentry SDKs on the browser and server; choose a hosted or separately managed self-hosted deployment. Configure releases, source maps, and desired tracing. Scrub sensitive data deliberately; do not rely on defaults to cover project-specific secrets. [Sentry scrubbing controls](https://docs.sentry.io/api/projects/update-a-project/)

Unexpected backend failures are captured once at a shared boundary, logged for investigation, and returned with a safe message and correlation ID. Expected permission/state/validation failures use stable public error codes and useful messages. Report caught unexpected frontend failures explicitly; render boundaries handle rendering failures, not every event-handler rejection.

GraphQL can return errors with HTTP 200 or partial data. Decide how each screen treats partial results. Error responses and telemetry serve different purposes: Sentry does not render the customer's fallback UI. Browser telemetry is best effort and can be blocked or lost offline. A separate frontend log pipeline is not required initially.

### 13. How to review an AI-generated change

Ask for the feature contract first, then review the smallest complete slice. Check changed files against their responsibility and run meaningful behavior checks:

- Success and expected output.
- Wrong principal, tenant, scope and record owner.
- Invalid input and forbidden state transitions.
- Concurrent requests and retries where relevant.
- Cache invalidation and reconnect behavior when used.
- Database constraints/migration behavior and absence of sensitive telemetry.

Test shared use cases directly as well as transport entry points. A disabled button is not proof of authorization. A successful build is not proof of transaction safety. Record unresolved limitations rather than labelling a demo production-ready.

### 14. Where to investigate

| Symptom | Start here |
| --- | --- |
| Wrong records or count | Query scope, filters, aggregation |
| Wrong button availability | Capability field resolver → policy/state rule |
| Unauthorized mutation succeeds | Use-case policy enforcement and actor construction |
| Stale screen | Query cache invalidation, subscription recipients, frontend refresh |
| Duplicate operation | Use-case idempotency and transaction/concurrency handling |
| Only one backend instance receives updates | Shared Pub/Sub wiring and subscriber lifecycle |
| Public API differs unexpectedly | REST DTO/response mapping, then shared use case |
| File exists but is unusable | Upload confirmation, metadata state, storage permissions |
| Missing diagnostics | Boundary capture, correlation IDs, SDK/collector configuration |

These conventions keep important decisions visible without forcing an abstraction for every line of code.


---

## Feature specification: <name>

Use this form in the conversation or project documentation for each feature. Replace every placeholder. Mark irrelevant sections “Not needed” with a brief reason; do not invent infrastructure to fill them.

### Purpose and scope

- User problem and intended outcome:
- Actors and organizations involved:
- Included actions:
- Explicitly excluded actions:

### Data / ERD

| Entity | Ownership / tenant | Required fields | Relationships | Constraints / indexes |
| --- | --- | --- | --- | --- |
| <entity> | <scope> | <fields> | <relations> | <invariants> |

Allowed states and transitions:
Deletion/retention behavior:
Migration/backfill requirements:

### Policies

| Action | Principal / scope required | Record condition | State condition | Safe denial message |
| --- | --- | --- | --- | --- |
| <action> | <permission> | <ownership/tenant> | <domain rule> | <message> |

Readable record and field scope:
Credential expiry and permission-revocation behavior:
UI capability names and reasons:

### Process: <use-case name>

- Caller(s): GraphQL / public REST / job / other feature.
- Input, defaults, validation and trusted context:
- Preconditions and authorization:
- Ordered business steps:
- Writes that must commit together:
- External side effects and their timing:
- Concurrency control:
- Retry/idempotency contract:
- Errors and public error codes:
- Result:
- Cache invalidation and events after commit:
- Crash recovery / compensation if required:

Repeat for each operation.

### Queries and caching

| Query | Access scope | Filters/order/page limit | Returned data | Cache / TTL | Invalidating writes |
| --- | --- | --- | --- | --- | --- |
| <query> | <scope> | <filters> | <shape> | <key and lifetime or none> | <operations> |

Acceptable staleness:
Behavior during Redis failure:
Concurrent refresh and invalidation-race strategy:
Batching / query-cost limits:

### Frontend operations and behavior

| Screen/action | GraphQL operation | Selected fields | Loading/error/empty behavior |
| --- | --- | --- | --- |
| <screen> | <query/mutation> | <selection> | <behavior> |

Include the actual operation documents or link to their canonical files.
Capability-driven buttons:
Partial GraphQL error handling:

### Realtime

- Trigger and commit timing:
- Authorized recipients and field visibility:
- Subscription arguments and validation:
- Event payload (include an example):
- When frontend subscribes/unsubscribes:
- Frontend response: refetch or patch:
- Initial snapshot/stream ordering:
- Reconnect, revocation and missed-event recovery:
- Duplicate/out-of-order event handling:
- Batching/backpressure limits:
- Transient or durable delivery requirement:

### Public API, if exposed

- Versioned method/path:
- Credential type and scopes:
- Input and output examples:
- Error codes / HTTP statuses:
- Pagination/rate limits/idempotency:
- Shared query/use case called:
- Compatibility commitments:

### Files, if used

- Allowed sizes/types and validation/scanning:
- Metadata ownership and object-key scheme:
- Upload confirmation and ready state:
- Download authorization and URL expiry:
- Orphan cleanup/deletion/retry behavior:
- Application versus storage audit logging:

### Observability

- Business outcomes logged:
- Unexpected errors captured at which boundary:
- Correlation IDs and safe diagnostic fields:
- Sensitive fields excluded:

### Acceptance checks

Write expected observations, not just “test permissions.”

- [ ] Authorized success produces <result>.
- [ ] Wrong organization sees <response> and no data leakage.
- [ ] A direct API call without permission produces <error> and no writes.
- [ ] Invalid input/state produces <error>.
- [ ] Concurrent/repeated requests produce <defined outcome>.
- [ ] Related writes commit/roll back together.
- [ ] Cache/realtime behavior matches the stated contract.
- [ ] Relevant error/loading/empty UI states work.
- [ ] Checks run and unresolved limitations are recorded.

### Implementation map

List the files to add/change and their single responsibility. Record verification commands and results after implementation.


---

## Worked contract: complete an assignment

This illustrative specification shows how to apply the conventions. Adapt the entity, permissions, API names and behavior to the actual project.

### Data and authorization

Assignment: `id`, `organizationId`, `assigneeId`, `status`, `version`.
States: `OPEN`, `IN_PROGRESS`, `DONE`.

A principal needs `assignments.complete.own` and must be the assignee, or needs `assignments.complete.all`. Both grants are confined to the actor's organization. An integration additionally needs its credential's `assignments:write` scope. Service principals are not assumed to be human assignees.

UI returns `canComplete` and nullable `completeReason`. A permitted user still receives `false` for a completed assignment. A caller outside the readable scope receives not-found without details about another organization's record.

### Process

1. Accept an assignment ID and verified actor.
2. Load the record inside the readable tenant scope.
3. Check action permission and reject `DONE` with `ASSIGNMENT_ALREADY_COMPLETED`.
4. In one transaction, conditionally update using the checked version and write an activity entry. If the conditional update changes zero rows, reject with `ASSIGNMENT_CONFLICT`.
5. After commit, invalidate affected summary caches and publish `assignment.changed`.
6. Return the assignment in the interface's public response shape.

Two concurrent completions produce one successful transition and one state/conflict error, with one completion activity entry. This example deliberately rejects repeated completion; a public integration needing retry-stable responses should add a documented idempotency-key contract.

No emails or remote calls execute inside the database transaction. Realtime delivery is transient here. If completion must trigger a guaranteed downstream action, add an outbox record to step 4 and an idempotent consumer; do not claim the transient notification guarantees it.

### Interfaces

```graphql
mutation CompleteAssignment($id: ID!) {
  completeAssignment(id: $id) {
    id
    status
    capabilities { canComplete completeReason }
  }
}
```

Optional public interface: `POST /api/v1/assignments/:id/complete`. Its controller calls the same use case and maps the result/errors to its documented REST contract.

### Cache and realtime

The organization dashboard caches status totals for up to 30 seconds. Only use organization-only keys if every member has the same readable set; otherwise include access scope. Completion changes the cache generation after commit. Cache failure is logged and normal reads fall back to PostgreSQL; a failed invalidation may leave older totals until expiry.

Event example: `{ "kind": "assignment.changed", "entityId": "a123" }`. Publish only to recipients allowed to know that assignment exists. The open screen subscribes and refetches after readiness, then batches invalidations into one refresh at a time. Reconnect triggers a fresh query. Closing the screen releases the subscription. Grant revocation removes access to the stream as well as future queries.

### Evidence to request from the coding agent

- Assignee and authorized manager succeed; another member and a read-only integration fail.
- Another organization cannot read, complete, or receive notifications about the assignment.
- Completing `DONE` fails; bypassing the UI does not bypass the policy.
- Concurrent completions create one status transition and one activity entry.
- Failed transaction leaves neither the update nor its activity.
- Cache refresh reflects the committed count change.
- Two authorized clients observe the update; a reconnected client reads current data after missing an event.
- Public REST and GraphQL share the operation's authorization/state behavior.
