# JWT and feature-policy verification — 9 September 2026

## Scope and environment

All dependency installation, builds, migrations, integration execution and Chromium execution ran on the VM, under `/mnt/sb2dev`. Local work was source editing and source synchronization. Existing live services were not changed. A development database backup was taken before applying the credential migration. The new credential table and nullable profile fields are additive migrations.

## Automated evidence

- Backend Nest build and frontend Next production build.
- `backend/scripts/check-framework.cjs` plus `check-authorization.cjs`: 121 assertions against a disposable database, real Nest requests and a production Next fixture. Tests cover CMS save/publish/restore, fixed test IDs, mixed question types, history/audit rollback, stale versions, atomic program publication/import, attempt idempotency and ownership, SSR, password login, JWT validity/expiry/audience, disabled accounts, version revocation, profile field persistence, role escalation rejection, cross-user reads/writes, diploma deletion, chat isolation, school access/counts, restricted CMS capabilities, password-account registration bypass and logout.
- `scripts/check-browser.cjs`: 162 browser assertions across the six provisioned accounts. Visits student dashboards/tests/navigator/portfolio/profile/chat; teacher course/handbook/profile/analytics/reports/bonus/guide/assistant; admin lists/history/settings/test/program/course editors; public pages and wrong-password feedback. Checks route responses, JavaScript exceptions, profile identity and editor layout.
- `scripts/check-browser-actions.cjs`: 15 browser assertions. Completes all sections of DeBruce, MBTI and Holland, verifies saved history and account isolation, edits/reloads/restores profile fields, completes the five-step teacher onboarding, verifies CMS live preview and draft persistence, restores the edited draft value and signs out of the admin account.
- `scripts/check-registration.cjs`: two browser assertions on the development app: existing student registration/profile creation works and registration cannot enter a password-protected administrator account.

Integration databases are deleted after execution. Browser attempts belong to disposable test accounts. Profile and CMS values changed during successful interaction checks are restored; CMS history retains those test saves. The registration walkthrough uses `registration.browser@sb2.test` as a separate disposable student.

## Findings addressed

- Content-administrator status no longer grants access to other users' private records.
- Arbitrary teacher passwords no longer authenticate.
- Backend authentication now verifies standard JWTs through jose and reloads account grants/version from the database.
- Password accounts cannot be entered through the development registration shortcut.
- Student and teacher profiles load the signed-in database identity instead of another account's browser-cached profile. Saves report failures and persist name/contact changes.
- Profile editing waits for initial loading, preventing a delayed response from overwriting an immediate edit. Email is read-only until an email-change verification flow exists.
- Login fields and submit wait for browser initialization, avoiding a native form submission on cold development loads.
- Admin logout clears the Auth.js session as well as the content-admin cookie.

## Limits

This is broad regression coverage, not proof that every possible click, browser, malformed input or concurrency scenario is tested. PDF exports, all external links, mobile layouts and every course quiz permutation were not exhaustively exercised. Teacher analytics, AI answers and diagnostic report interpretations still include demo content. SMTP, real email verification, password recovery, production self-service account provisioning, verified uploads and external telemetry remain unimplemented.

The public port 3025 remains a development deployment so the requested registration prototype works. Its HTTP endpoint is intended for disposable test credentials. Next development compilation can restart at its memory threshold during exhaustive route crawling; broad browser checks use the compiled build on temporary loopback port 3027. Chromium dependencies/fonts were extracted on the development disk rather than installed into the VM's live system library paths. That temporary service is stopped after checks.

## Evidence locations on the VM

Logs are under `/mnt/sb2dev/backups/`: `jwt-api-build.log`, `jwt-web-build.log`, `jwt-framework-check.log`, `jwt-browser-check.log`, `jwt-browser-actions.log`, `jwt-registration-check.log`. Screenshots are under `browser-jwt/`. `jwt-deployed-login-final.log` records six successful logins and authorized profile reads through the public VM address. Private test passwords are in `/mnt/sb2dev/sb2/.data/test-accounts.json` and the ignored local account guide; they are not committed or logged.
