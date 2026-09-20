# Language selection and translation editing

- Data: `sb-locale` is the visitor's RU/KK/EN content preference. CMS translations retain their existing separate PostgreSQL documents, drafts, publications, history and source snapshots. The admin editing locale is stored in the editor URL, independently of the visitor preference. No translations are generated or published on behalf of editors.
- Processes: shared student, teacher and landing controls set the same cookie and reload localized server content. Admin language changes warn before discarding unsaved edits; reload preserves the chosen editing language. The public-page link opens that locale. Translation save/publish/restore keeps existing revision checks, atomic audits and no automatic retry. Existing bilingual landing text retains its shape and source-change fallback.
- Policies: locale selection grants no permissions. Existing content-admin rules protect drafts and mutations; shared IDs, numbers and structure cannot be changed through translations. Locale redirect destinations must stay on this application.
- Queries: published queries accept only `ru`, `kk`, `en`; missing/stale translations fall back to current Russian source. Draft previews use the explicitly selected language and ignore stale requests. Program previews resolve published institution names in that language. Program translations are edited in their own program records instead of duplicated institution fields; links to the program library retain the chosen language.
- Frontend operations: existing feature GraphQL operations continue carrying the locale. Add a small same-origin cookie/redirect endpoint for the admin's public-page link. Shared language labels are a CMS page document under Shared elements, with defaults, usage links and preview.
- Realtime: no subscriptions. Language selection reloads; drafts update the existing preview requests. Admin UI controls remain Russian; the material selector chooses the content language.
- Acceptance: remote production builds; disposable-database checks for independent RU/KK/EN drafts/publications, stale revisions, protected fields, fallback, bilingual landing translation, selected locale after reload, live previews, public-page links and visitor header controls on desktop/mobile. Do not write sample translations to the data-entry database.

The language-flow regression check is `scripts/check-language-flow.cjs`, invoked by the existing remote framework suite with `CHECK_LANGUAGE_UI=1`. It checks actual translated page headings, editor previews, save/reload/publish, cancellation of an unsaved language switch, redirects and mobile controls. The suite creates and removes its own database on the development cluster.

These checks also exposed an existing lesson-validation error: repeated blocks of the same kind were checked against the first matching block, which incorrectly required optional descriptions. Validation now prefers the matching record or positional block; required lesson titles and unsafe-content checks remain enforced.

No Kazakh or English content was auto-published to the data-entry database. Editors choose **Язык материала**, enter their translation, and publish that language. Russian remains the fallback, and the admin interface itself remains Russian.

Verification on 2026-09-17:

- Frontend production build and NestJS build passed on the VM.
- The disposable framework suite with `CHECK_LANGUAGE_UI=1` passed all 194 checks, including translated institution/program/lesson/test previews and student/teacher desktop/mobile controls.
- Authenticated, read-only browser verification on port 3025 passed all three header languages, the Kazakh editor after reload, the new CMS document and the public-page link. Redirects use a validated local path so Next's internal bind address cannot replace the public hostname.
- Registered only the missing `copy.components.content-language` default. A before/after fingerprint confirmed every other editorial document was unchanged. No sample translations were published to the data-entry database.
- VM logs and screenshots: `/mnt/sb2dev/backups/language-check-20260917.log`, `/mnt/sb2dev/backups/language-build-20260917.log`, `/mnt/sb2dev/backups/language-flow-20260917/`.
