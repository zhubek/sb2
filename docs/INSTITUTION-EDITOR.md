# Institution editor corrections

- Data: retain existing institution IDs, kinds, industry links, contacts and editorial revisions. The stored legacy `nOps` field is no longer an editable or authoritative count; derive the displayed count from the published program lists (including additional university programs and the college fallback). No database migration or content overwrite is required.
- Processes: the institution form preserves hidden fields and adds an optional empty Instagram input when an older record lacks it. Existing draft/save/publish/restore transactions, audits, revision conflicts and explicit retry behavior remain in force.
- Policies: existing content capabilities and backend restrictions on ID/kind remain authoritative. An institution may have no assigned industries; clearing the selection is valid. Preview remains authenticated and does not publish anything.
- Queries: derive counts when assembling the public content snapshot, using the same program selection as institution details. Draft preview computes its count from its rendered groups. Display only safe Instagram destinations.
- Frontend operations: use the existing content GraphQL/BFF operations and preview endpoint. Hide the technical ID; show a readable institution type and a read-only program count. Name industry selections and explain their navigator-filter purpose. Reuse InstitutionView for student, teacher and editor contact displays.
- Realtime: none; local edits refresh the existing preview request, with stale responses discarded.
- CMS: Instagram remains an institution contact field shared across languages. Its displayed destination is the editable contact value, so no new static page-copy field is introduced. Keep the existing catalog category, usage URL and public-component preview.
- Acceptance: verify university/college/foreign count rules, ignore stale counters, compare navigator card and detail counts, check ID/kind remain protected, change industry selection and Instagram in an unsaved preview, check existing public Instagram links and empty/invalid values, confirm drafts/publications are unchanged by verification, and run the production build remotely.

## Verification — 14 September 2026

- Backend production build and final Next.js production build passed on the isolated VM.
- `scripts/check-institution-editor.cjs`: 35 checks passed against the temporary production frontend on loopback port 3027. Coverage includes college fallback counts, additional university programs, protected ID/kind rejection, named industry controls, Instagram preview/public links, empty/unsafe links, and the mobile Publish button.
- Compared institution draft/revision and public content before and after browser checks: unchanged. No successful test writes were made to editorial documents.
- Reviewed desktop, mobile and public-page screenshots in `.data/institution-editor-20260914/` (local) and `/mnt/sb2dev/backups/institution-editor-20260914/` (VM).
- Logs: `/mnt/sb2dev/backups/institution-editor-{api-build,build,checks}.log`.
- Testing against the Next development server initially hit the VM's memory limit. It restarted automatically; remaining browser checks passed against the production build. The temporary production service was stopped afterward.
- Final VM smoke: the institution page on port 3025 returned HTTP 200; `sb2-dev-web`, `sb2-dev-api` and `sb2-dev-db` were active. Existing live services were not modified.
