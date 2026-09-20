# CMS data-entry release — 9 September 2026

## Delivered

The content editor supports Russian, Kazakh and English. Select **Язык материала**, enter text on the left, check the public-component preview on the right, then save a draft or publish that language. Translation fields show the Russian source. Common values such as IDs, prices and answer values are edited in Russian and are protected in translation mode.

Translations reuse the existing content documents, histories and audit transactions. They do not create additional tests or overwrite Russian content. Existing bilingual landing text is retained. Untranslated content falls back to Russian; source text that changes subsequently also falls back until its translation is updated. This is a translation-entry workflow, not automatic translation. Some fixed application interface text remains Russian.

The feature contract and storage format are described in [MULTILINGUAL-CONTENT.md](MULTILINGUAL-CONTENT.md). Backend rules live in `backend/src/modules/content/domain/localization.ts`, `queries/content.queries.ts` and `use-cases/edit-content.use-case.ts`. The editor is in `components/admin/editor.tsx` and `translation-editor.tsx`; feature GraphQL operations remain in `features/content/graphql`.

## Verification

- NestJS and Next.js production builds passed on the VM.
- **153 assertions passed** in the combined framework suite: the existing 121 checks plus 22 multilingual integration checks and 10 recorded browser checks. This uses a disposable database and real Nest/Next servers.
- Multilingual coverage includes draft privacy, independent publication/revisions/history, invalid locales, authorization, fixed test identity, protected shared fields, changed-source fallback, translated test submission, backup restoration into a base-only database, BFF locale forwarding, server-rendered language, landing publication, visitor language switching, and teacher-course/navigator/test previews.
- The earlier recorded action suite passed **15 assertions**, covering all three complete test submissions, saved attempts and account isolation, student/teacher profile save/reload/restore, onboarding, CMS draft preview/save/reload/restore and logout.
- The final broad browser run passed **162 assertions** across six roles/accounts and public routes; its seven recordings were refreshed against the current production build.
- Both development registration checks passed. All **six public-VM password logins and authorized profile reads** passed against port 3025.
- All **11 video files** were decoded in Chromium: 1440×1000 WebM. The multilingual CMS walkthrough is 26 seconds; the test/profile/CMS action walkthrough is 52 seconds. The results screenshot and published-English-page screenshot were visually inspected.

The multilingual recording ends with a test-results card. Its sample publication occurs only in the disposable test database. Password fields are masked, and tokens/passwords are not included in the reports.

## Data-entry environment

- CMS: `http://136.112.254.16:3025/admin`
- Password login: `http://136.112.254.16:3025/login`
- App source/runtime: `/mnt/sb2dev/sb2`; isolated PostgreSQL port 5437; backend loopback port 3030; public frontend port 3025.
- Read-only inventory after verification: **11,630 base content documents**, exactly **three fixed tests**, **9,268 education-program offerings**, and **six enabled test password accounts**. No sample English/Kazakh translation records were inserted into the data-entry database by the multilingual tests.
- A database snapshot was taken before this release: `/mnt/sb2dev/backups/pre-jwt-1788935910384.dump`. CMS JSON export/import includes translations; the existing 25 MB import size limit still applies. Larger recovery uses the database backup.
- The private account guide is `.data/remote-migration/TEST-ACCOUNTS.md` locally. Credentials are intentionally excluded from source control and this report.

The public instance remains a development deployment so the existing development registration flow continues to work. The three isolated development services are active and enabled at boot. The temporary browser-test web service was stopped after verification. Existing live services remain active and their database was not modified. Runtime remains on the VM; local files are source and downloaded evidence.

## Functional limitations

This is broad functional regression coverage, not proof of every possible click or input combination. Mobile layouts, every external link, PDF/print output and all quiz permutations were not exhaustively tested.

- Career-test answers are saved, but DeBruce/MBTI/Holland interpretations still contain predefined demo results; an answer-derived scoring engine is not implemented.
- Course quiz scoring exists, but the current teacher-course UI still stores lesson progress in browser local storage.
- Gamification has achievement and organization-log endpoints and point aggregation. Automatic reward rules and the proposed organization/awarded-point snapshots are not implemented by this CMS release. Some dashboards, rankings and AI responses still use demo content.
- SMTP delivery, real email verification, password recovery and verified uploads remain outside this release.

## Evidence

On the VM, `/mnt/sb2dev/backups/app-review-20260909/` contains `multilingual-cms.webm`, the published-page/results screenshots, the test-action walkthrough, role-based route recordings and registration recordings. A downloaded copy is in the ignored local directory `.data/app-review-20260909/`.

Logs: `multilingual-api-build.log`, `multilingual-web-build.log`, `multilingual-framework-check.log`, `multilingual-pages.log`, `multilingual-registration.log`, `multilingual-deployed-login.log`, `multilingual-video-check.log`, and `multilingual-data-entry.json` in `/mnt/sb2dev/backups/`.
