# Страницы и их запросы

Что делает каждая страница фронтенда: какие запросы уходят в бекенд
(`/api/...` → `http://localhost:3002/api`), что остаётся на мок-данных.

Общий принцип интеграции: все вызовы идут через `lib/api.ts` (`apiSafe`) —
**при недоступном бекенде страница откатывается на мок-данные** и демо
продолжает работать. Идентификатор пользователя в БД (`backendId`)
попадает в сессию при входе (см. `lib/auth.ts`) и читается клиентом через
`backendUserId()`.

Обозначения: 🔌 — живой запрос к бекенду · 📦 — мок/статические данные.

---

## Вход и сессия

| Страница | Запросы |
|---|---|
| `/auth` (ученик) | 🔌 server action `requestOtp(email)` → генерация кода (`lib/otp.ts`); 🔌 `signIn("otp")` → `POST /api/auth/callback/credentials` (Auth.js); внутри колбэка `jwt` → **`POST {API}/users`** (upsert, связывает сессию с БД); после шага «О себе» имя сохраняется в localStorage |
| `/teacher/login` | 🔌 `signIn("teacher")`; колбэк `jwt` → **`POST {API}/users`** с ролью TEACHER |
| выход (профиль/меню педагога) | `signOut()` — сброс сессионной куки |
| `middleware.ts` | проверка сессии на каждый переход в защищённые разделы; без запросов к бекенду (JWT в куке) |

## Платформа ученика

| Страница | Запросы |
|---|---|
| `/dashboard` | 📦 брифы отчётов (report-data); шапка: см. чек-лист ниже |
| шапка (чек-лист «Мой прогресс») | 🔌 `GET /users/{id}/achievements` — начальное состояние; 🔌 `POST /users/{id}/achievements/{achId}` при выполнении шага (событие `checklist-step-done`, конфетти) |
| `/tests` | 🔌 `GET /tests` (число вопросов) + 🔌 `GET /users/{id}/attempts` — статус «пройден» и «История прохождений» из БД; 📦 краткие визуальные результаты (TopSkillCards и т.п.) |
| `/tests/debruce` · `/tests/mbti` · `/tests/holland` | 📦 вопросы (mock-data, совпадают с сидом БД); по завершении 🔌 `recordTestAttempt`: `GET /tests` → `GET /tests/{id}` → `POST /tests/{id}/attempts` → `POST /attempts/{id}/answers` (на каждый вопрос) → `PATCH /attempts/{id}` (FINISHED + result) |
| `/tests/*/report`, `/tests/report` | 📦 полные отчёты (report-data; генерация отчётов ИИ — след. этап) |
| `/chat` | 🔌 первый вопрос → `POST /chats`; каждое сообщение → `POST /chats/{id}/messages`; текст ответа ассистента стримится из ответа API (заглушка бекенда, подключение Claude API — след. этап) |
| `/portfolio` | 🔌 `GET /users/{id}/diplomas` (добавляются к мок-карточкам); форма → 🔌 `POST /users/{id}/diplomas`; 📦 файл не загружается (S3 — след. этап) |
| `/profile` | 📦 чтение из localStorage; «Сохранить» → 🔌 `PATCH /users/{id}` (имя, фамилия, класс, язык) + localStorage |
| `/universities`, `/universities/[id]`, `/universities/gop/[code]`, `/universities/college/[code]` | 📦 серверный рендер из `lib/nav/*.json` — **тот же датасет, которым засеян бекенд**; REST-зеркало (`/navigator/*`) готово для будущих клиентов/мобильного приложения |
| `/onboarding` | 📦 без запросов |

## Платформа педагога

| Страница | Запросы |
|---|---|
| `/teacher` (дашборд) | 📦 агрегаты школы (teacher-mock-data; аналитика по реальным попыткам — след. этап) |
| `/teacher/analytics*` | 📦 |
| `/teacher/bonus` | 🔌 `GET /users/{id}` → `GET /organizations/{orgId}/points` (итог сезона и разбивка по блокам) + 🔌 `GET /users/{id}/org-logs` (лента начислений); 📦 лидерборд и значки |
| `/teacher/course*` | 📦 контент (course-module1, совпадает с сидом); прогресс/сдача квиза через API — след. этап |
| `/teacher/handbook*` | 📦 как `/universities` (общий датасет с бекендом) |
| `/teacher/reports`, `/teacher/profile`, `/teacher/assistant`, `/teacher/guide` | 📦 |

## Публичные страницы

| Страница | Запросы |
|---|---|
| `/` (лендинг), `/design`, `/verify/[id]`, `/professions`, `/skills`, `/popularuniversity`, `/workingprofessionsgen`, `/admin` | 📦 без запросов к бекенду |

---

## Что подключается следующим этапом

1. **Guard'ы бекенда** — проверка сессии Auth.js на эндпоинтах (сейчас открыты).
2. **Claude API в чате** — `backend/src/chat/chat.service.ts`, место помечено.
3. **Генерация отчётов ИИ** — отчёты `/tests/*/report` из `result` попыток.
4. **Аналитика педагога** — агрегаты по реальным `UserTest` школы.
5. **S3** — файлы дипломов и фото профиля.
6. **Навигатор через API** — перевод страниц `/universities*` с локального JSON на `/navigator/*` (датасет уже общий).
