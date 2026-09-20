# Page categories

The Pages and texts library groups existing materials into Landing, Sign-in and registration, Navigator and directories, Student area, Teacher area, and Shared elements. This organises the page-copy library; diagnostic definitions and education records retain their existing sections.

Page-content changes and CMS support are one task: update editable fields/labels, defaults, category, usage links and preview together. New page content must appear in the admin library; changed or removed fields must remain consistent with the page while preserving existing editorial data. Verify both surfaces before calling the change complete. This requirement is also recorded in AGENTS.md.

- Data: categories are derived from stable material IDs using ordered rules in the content domain. Every page material belongs to exactly one category; unmatched/new shared content remains accessible in Shared elements. No schema or content migration.
- Processes: read-only filtering. No new writes, audit events, mutation retries or publication behaviour. Rows, totals and facets are read in a repeatable-read transaction so concurrent content updates cannot produce an internally inconsistent response.
- Policies: existing content-admin authorization precedes both record queries and category counts. Anonymous/student callers cannot read the library.
- Queries: category predicates execute in Prisma before the existing 30-row pagination. Facet counts reflect search and draft filters across all page categories. Unknown categories or categories applied outside the pages group are rejected.
- Frontend operations: the existing feature-owned ContentLibrary GraphQL operation accepts pageCategory through the BFF. Category cards show counts and descriptions, All pages clears the category, and the current category/search/status/page remain in the URL and editor return link. HTTP-200 GraphQL failures continue through the shared error boundary. URL updates use the [Next.js native history integration](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api).
- Realtime: none. Switching filters refetches the list; superseded requests are cancelled and cannot overwrite the current result.
- Acceptance: all page materials appear once across categories; named representative pages map correctly; category totals and facets match search/status filters; pagination occurs after filtering; unknown/unauthorized requests fail; catalog filtering remains functional; editor return, reload and browser Back retain category state; desktop/mobile layout fits its viewport. Builds and checks run on the isolated development VM.

Verified on 14 September 2026:

- NestJS and Next.js production builds passed on the VM.
- 23 checks in `backend/scripts/check-page-categories.cjs` passed against a disposable database, which was removed afterwards. These cover category precedence, complete coverage, pagination, search/draft combinations, unknown categories, permissions and catalog compatibility.
- 32 checks in `scripts/check-page-categories.cjs` passed against the compiled application. Every one of the 91 live page materials appeared exactly once across categories. Search, status, empty results, editor return, reload, browser Back and mobile layout passed without uncaught JavaScript errors.
- Five checks against `http://136.112.254.16:3025` passed: account login, category cards, filtering, editor return and mobile layout. The development web, API and isolated database remain running; no content edits were saved or published.

Current category counts: Landing 13; Sign-in and registration 4; Navigator and directories 22; Student area 18; Teacher area 25; Shared elements 9. Categories are assigned from the content definitions, rather than manually managed by content editors.

Screenshots: [desktop](C:/Users/zhumi/Documents/Projects/sb2/.data/page-categories-20260914/categories-desktop.png), [mobile categories](C:/Users/zhumi/Documents/Projects/sb2/.data/page-categories-20260914/categories-mobile.png), [mobile results](C:/Users/zhumi/Documents/Projects/sb2/.data/page-categories-20260914/category-mobile-results.png). Build/browser/public-check logs are under `/mnt/sb2dev/backups/page-categories-*.log` on the VM.
