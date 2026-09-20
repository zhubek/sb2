# Content Studio correction contract

Source: the user's correction notes dated 10 September. The reported counts are a review inventory, not a guarantee of current coverage.

- Data: retain all CMS drafts, publications and translations. Temporary preview snapshots contain one document value, language, allowed page, owner fingerprint and expiry in the isolated VM's `.data/content-previews` directory. They are valid for ten minutes; expired files are removed on subsequent preview creation, which also bounds the cache. They never enter content history or public storage. No new database entities.
- Process: authenticated editor requests a preview for a known document and one of its registered usage locations. Render the real application page in an iframe using a request-scoped draft override for client and server components. A later preview request gets a new random token; ignore superseded responses. No mutation retries or publication occurs. Editor fields remain on the left; right-hand preview supports desktop/mobile widths and links to the actual usage location.
- Policies: verify content-admin access on creation and viewing, bind snapshots to the verified account and an HTTP-only random browser cookie, and expire/reject missing, foreign or revoked sessions. Preview rendering grants no additional record access. Prevent preview forms, writes, downloads, storage changes and navigation from changing the actual account. Ordinary page requests never consume preview overrides.
- Queries and frontend operations: retain the existing content GraphQL operations. Next preview adapters only read authorized backend content and render local UI; backend content remains authoritative. Read the backend's exact decoded document ID at URL boundaries, with one controlled decode for percent-encoded IDs and no repeated decoding.
- Realtime: no subscriptions. Debounce draft snapshots, abort old requests and replace only the latest iframe. Public pages and existing focused course/test/navigator previews are reused.
- Acceptance: all reported content groups have a mapped public page or an explicit explanation if a value is not used; Cyrillic industry/direction/profession links open from the library; representative text edits appear inside actual layouts; language selection applies to previews; anonymous/cross-session/revoked previews are rejected; preview activity creates no CMS saves, attempts or profile changes; builds and browser checks run only on the isolated VM.

An additional review finding is that training videos were listed in CMS but not rendered on the teacher guide. Add that list to the actual guide, without inventing playable media URLs. Display where each course material belongs.

Navigator validation also needs to distinguish program classification codes from record IDs. The same code can occur in offerings at several institutions; it is not a unique key for an industry list. Continue rejecting duplicate explicit item IDs and preserve fixed test/program identities. This changes validation only, retaining existing transactional saves, audits, revision checks and retry behavior.

## Delivered — 13 September 2026

- Cyrillic industry, direction and profession IDs are decoded once at the editor and BFF URL boundaries. Their editors open from the navigator library; direction previews expand the relevant group, and profession previews open the relevant profession.
- Former generic data dumps now use real application pages. Fields remain on the left. The right pane offers page selection, panel/desktop/phone widths, expansion, Escape to close, and refresh. Course materials automatically scroll to their section. Report materials default to their corresponding report.
- Usage links explain where a material appears. Teacher training videos now appear in the actual teacher guide alongside guides, student handouts and FAQs. Existing video data contains titles and durations only; no playable media URLs were invented.
- The industries list also received a server-rendering fix: deferred child components now load their own request-scoped content context.
- Preview creation does not save or publish content. Viewing requires current content-admin access, the originating browser cookie and a valid, unexpired token. Preview UI blocks network writes, account logout, programmatic navigation and browser-storage writes while retaining local interactions. Normal pages ignore preview headers.
- The temporary snapshot reader validates access before resolving its promise, including in Next development mode, whose debugging payload can expose intermediate awaited values. No database migration or additional assessment was introduced.

## Verified on the isolated VM

NestJS and Next.js production builds passed. **167 framework/integration assertions passed** against a disposable database, including multilingual editing/publication, actual Cyrillic industry saves, repeated program codes, duplicate-ID rejection, anonymous/foreign/expired/revoked previews, forged headers and unchanged publications.

The recorded walkthrough passed **33 browser assertions**: all three Cyrillic categories, specific navigator previews, live unsaved text, mobile/expanded views, automatic course-section scrolling, teacher materials, landing/report layouts, cross-editor privacy, unchanged profile data and protected logout. It reported no uncaught JavaScript errors. The 31.84-second, 1600×1050 WebM was decoded successfully; the teacher-material and report screenshots were visually reviewed.

Every one of the **128 materials** in the notes was checked through the authenticated editor API and its default preview route:

| Group | Real page rendered | Explanation shown |
| --- | ---: | ---: |
| Pages and text | 87 | 4 |
| Reports and recommendations | 18 | 3 |
| AI | 5 | 0 |
| Course materials previously lacking previews | 5 | 0 |
| Achievements and bonuses | 4 | 0 |
| Navigator reference collections | 2 | 0 |
| **Total** | **121** | **7** |

This verifies page rendering and representative edits; it does not mean that every text field or every interactive state was individually exercised. Existing focused test, lesson and institution/program previews remain in place.

Five final checks against the public development URL passed: password login, unsaved page preview, private development output, no CMS save, and the industries page. Runtime remains at `http://136.112.254.16:3025`; source, backend and isolated PostgreSQL remain under `/mnt/sb2dev`. Existing live services and the live database were not modified.

## Materials with explanations

- `mock-data.recommendedIndustries`, `mock-data.colleges`, `mock-data.gops`: unused sample recommendation datasets.
- `copy.components.download-report`, `copy.components.landing-steps`: unused older components.
- `copy.components.custom-test`: fallback template; the three fixed tests use their own pages.
- `copy.app.platform.tests.attempts.id.page`: a saved-answer screen requires a particular attempt belonging to the current user. A generic preview is not supplied.

These entries are preserved and clearly identified. They are not presented as connected public screens. Career-test scoring, automatic gamification, SMTP and playable training-video media remain outside this correction release.

## Evidence and operation

Reproducible checks: `backend/scripts/check-framework.cjs`, `backend/scripts/check-page-previews.cjs`, `scripts/check-content-usage.cjs`, and `scripts/check-preview-corrections.cjs`. The source-derived usage index can be regenerated with `scripts/generate-content-usage.py`; reviewed route preferences are in `lib/cms/usage.ts`.

VM evidence: `/mnt/sb2dev/backups/cms-corrections-20260913/` contains the walkthrough, screenshots, result card and per-material JSON results. Build, integration, inventory, browser and public-smoke logs are `/mnt/sb2dev/backups/corrections-*.log`. Downloaded evidence is in the ignored local `.data/cms-corrections-20260913/` directory.

The VM system disk was full during verification. Build caches and temporary files were directed to the added development disk, which had approximately 17 GB free. The system disk still needs separate maintenance; this work did not delete other services' files.
