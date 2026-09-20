# Design review · 13 September 2026

The visual foundation is good: clear headings, restrained colours, recognisable navigation, and useful content previews. The application still needs a focused usability pass before broad use. The most urgent problems affect access to controls and language selection; the biggest CMS inconvenience is how little space is available for actual editing on a laptop.

This is an analysis of the current application. No application code, CMS content, published translations, profiles, or test answers were changed.

**Scope and evidence**

Browser automation ran on the development VM, using the existing production build on a temporary localhost:3027 server and the same backend. The public :3025 admin sign-in screen was also inspected in the existing browser. The temporary server was stopped afterwards; the development web, API and isolated database services remain active.

- 18 route/role combinations, covering 17 distinct routes: landing and sign-in; admin overview, content library, education navigator, lesson/program/text/test editors; student dashboard, tests, MBTI introduction and questions, navigator; teacher dashboard, course, guide and bonuses.
- Primary viewport sizes: 1440 × 900 and 390 × 844. Additional editor checks: 1280 × 720 and 820 × 1180.
- 54 screenshots, including scrolled editors, a Kazakh translation editor, expanded preview, teacher mobile menu, and an active MBTI question screen. Representative screenshots were visually inspected; DOM measurements support the overflow, overlap and contrast findings.
- All 36 main route/viewport navigations returned HTTP 200. No uncaught page JavaScript errors were recorded during the main capture run. These observations do not constitute a full functional or accessibility pass.

Screenshots and measurements are in [the local evidence directory](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/results.json). Additional interaction and colour measurements are in [details.json](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/details.json). VM originals: `/mnt/sb2dev/backups/design-audit-20260913/`.

**What works well**

- The [landing page](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/landing-desktop.png) has a strong headline, one prominent primary action, and illustrations that explain the product. The hero adapts well to a phone.
- The [admin overview](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/admin-home-desktop.png) has logical content groups and a consistent sidebar. Published/draft status and separate save/publish actions are useful foundations.
- The [education-program editor](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/program-editor-desktop-preview.png) shows meaningful labelled fields beside a readable representation of the program, including tuition, admission score and language.
- The [test question layout](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/mbti-active-mobile.png) provides clear progress, section navigation and well-separated answer choices.
- The [teacher course](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/teacher-course-desktop.png) communicates module status and the next action clearly. The expanded CMS page preview is useful for inspecting a complete layout.

**Priority 1 · Fix before broader use**

| Finding | Observed evidence | Recommended change |
| --- | --- | --- |
| Floating controls obstruct other actions | At 390 px, the language selector covers the student’s bottom navigation, including the centre of the AI-chat link. Hit testing resolves that point to the language selector. At desktop width, the student AI button and teacher AI link cover the centre of the language selector. The teacher mobile course screenshot also shows the AI link covering part of “Продолжить”. | Put one language control in the header/menu. Reserve space for the assistant button and mobile navigation. Ensure no floating element covers another action, including while a menu is open. |
| Admin layouts overflow on small screens | All four sampled mobile editors have a 413 px document width inside a 390 px viewport. Publish extends from x=268 to x=413. The anonymous admin form is 420 px wide and produces 444 px of document width. At 820 px, the two-column editor extends to x=828. | Allow the save actions to wrap or use a compact mobile action layout. Make the sign-in card shrink to its container. Collapse the sidebar and change the editor layout before minimum column widths no longer fit. |
| The two language interfaces are disconnected | Student and teacher headers offer RU/KK, while the separate content selector offers RU/KK/EN. Clicking the header’s Kazakh button leaves the actual document language and content selector at `ru`. Source confirms that these header buttons update local UI state rather than the content-language cookie. | Use one shared RU/KK/EN control connected to the actual locale. Keep the selected state consistent after navigation and reload. Distinguish missing translations from a failed language change. |

Evidence: [student navigation overlap](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/student-home-mobile.png), [teacher course overlap](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/teacher-course-mobile.png), [clipped Publish button](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/course-editor-mobile-preview.png), [clipped admin sign-in](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/admin-login-mobile.png), [tablet editor](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/copy-editor-tablet.png).

**Priority 2 · Make daily editing comfortable**

**Give the content more of the viewport.** At 1280 × 720, both editor panels begin at y=408. The public-page iframe starts at y=650, while the sticky save bar occupies y=621–702. The initial view therefore shows almost no useful preview. The metadata banner, repeated usage controls, preview title, explanatory strip and toolbar consume too much height. Scrolling makes the editor usable, but adds friction to every editing session.

Use a compact title/language/action header. Show the usage selector once, move secondary explanations into contextual help, and let the two main panels fill the remaining height. Keep predictable scrolling within those panels. On a phone, use readily accessible “Fields / Preview” tabs or a preview drawer: the portfolio preview currently begins around y=2229, after the entire field list. Fullscreen and device preview controls should be consistent across text, course and navigator editors.

Evidence: [laptop editor](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/copy-editor-laptop.png), [desktop editor](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/copy-editor-desktop.png), [mobile editor](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/copy-editor-mobile.png).

**Improve small text and contrast.** Admin navigation is generally 12 px; many field labels, descriptions, status badges and table headings are 10–11 px. Their light colours make the interface harder to scan. The following ratios were calculated from computed foreground and background colours, not screenshot pixels:

| Visible text | Foreground / background | Size | Contrast |
| --- | --- | --- | --- |
| Library “На платформе” status | `#69967f` / `#eef6f2` | 10 px | 3.05:1 |
| Library column headings | `#9297a7` / `#fcfcfd` | 10 px | 2.84:1 |
| Library row description | `#7c8192` / `#ffffff` | 10 px | 3.88:1 |

These normal-text examples are below the 4.5:1 minimum described by [WCAG Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Disabled buttons and decorative logos were excluded. Use darker semantic text colours; consider 14 px for routine form/navigation text and 12–13 px for secondary information. Those font sizes are design recommendations, not WCAG minimum sizes.

The teacher menu’s two language buttons are each 34 × 19 px and directly touch vertically. Make them larger and separate them. [WCAG Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) specifies a 24 × 24 CSS-pixel target or an applicable exception, including sufficient spacing. For routine touch use, a more generous target is preferable.

**Name fields by their purpose.** The text editor uses “Текст 1”, “Текст 2”, and similar labels. A content editor must infer which field controls the title, description, upload button or drop-zone instructions. Use semantic labels, group them by the visible section, and highlight the matching preview element when a field receives focus. Put IDs and implementation paths in secondary metadata. The program editor’s existing labels are a better model. The Kazakh translation view usefully shows the Russian source, but would benefit from per-field translation status and a clear completion count.

Evidence: [text field labels](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/copy-editor-desktop-preview.png), [translation editor](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/translation-editor-kk.png).

**Make admin sign-in unambiguous.** The anonymous admin page offers an email/password link followed by a separate administrator-password form with the main “Войти” button. For the JWT test accounts, the email/password route should be the primary, clearly named path. If another access method remains necessary, explain who it is for and display it only in the relevant environment.

Evidence: [admin sign-in](C:/Users/zhumi/Documents/Projects/sb2/.data/design-audit-20260913/admin-login-desktop.png). This is a presentation finding; the separate administrator-password mechanism was not exercised in this review.

**Priority 3 · Consistency and content polish**

- Establish one product-name treatment: the CMS says “Smart Bolashaq”, the landing page says “AI профориентатор”, and the student/teacher interfaces use “профориентатор.” Different accent colours can distinguish roles while typography, logo treatment, controls and spacing remain recognisably related.
- Replace technical language such as “Запустить онбординг” with a user-facing action such as “Показать, как пользоваться”. The overview’s “Лендинг на двух языках” description is also stale now that three content languages are supported.
- Make sample content unmistakable. The test introduction says “демо”, while other screens show confident result summaries, sample names/statistics and a 2025/26 bonus season. Wherever those values are examples, show that status close to the information. Use meaningful empty states for real accounts without results. This design review does not validate scoring, analytics or points calculations.

**Suggested acceptance checks for the next design pass**

1. At 390 px and 820 px, sign-in and editors have no unintended horizontal document scrolling; all save/publish controls remain fully visible.
2. Student navigation, assistant access and language selection are independently clickable at desktop and mobile widths, with menus open and closed.
3. One RU/KK/EN selector reflects the actual content locale consistently after navigation and reload.
4. At 1280 × 720, the initial editor view shows an editable field and meaningful preview content. On mobile, switching between them does not require scrolling through the entire form.
5. Status text, labels and descriptions meet their applicable contrast requirements. Keyboard focus remains visible, and modal/menu focus behaviour is verified separately.
6. A content editor can identify a page heading, button label and description without knowing numbered text keys or source filenames.

Relevant implementation entry points: [admin styles](C:/Users/zhumi/Documents/Projects/sb2/components/admin/admin.css), [content editor](C:/Users/zhumi/Documents/Projects/sb2/components/admin/editor.tsx), [page preview](C:/Users/zhumi/Documents/Projects/sb2/components/admin/page-preview.tsx), [field labels](C:/Users/zhumi/Documents/Projects/sb2/components/admin/fields.tsx), [language selector](C:/Users/zhumi/Documents/Projects/sb2/components/content-language.tsx), [student navigation](C:/Users/zhumi/Documents/Projects/sb2/components/platform-nav.tsx), [teacher navigation](C:/Users/zhumi/Documents/Projects/sb2/components/teacher-nav.tsx), [admin sign-in](C:/Users/zhumi/Documents/Projects/sb2/components/admin/login.tsx).

**Limits of this review**

The review sampled representative layouts and interaction states; it did not inspect every material, all routes, every translation, Safari/Firefox, assistive technologies or all keyboard flows. Russian content was reviewed broadly, with the Kazakh CMS translation/fallback view sampled. A full English and Kazakh content review remains separate. Some emoji render as boxes in the VM capture environment; those were not classified as application defects. Existing functional verification remains documented separately in [CMS preview corrections](C:/Users/zhumi/Documents/Projects/sb2/docs/CMS-PREVIEW-CORRECTIONS.md).
