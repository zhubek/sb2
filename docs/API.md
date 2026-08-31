# Smart Bolashaq — REST API

Бекенд: NestJS + Prisma + PostgreSQL, каталог `backend/`.

- **Base URL**: `http://localhost:3002/api` (настраивается `PORT` в `backend/.env`)
- **Swagger (живая документация)**: `http://localhost:3002/api/docs`
- **Формат**: JSON; тела POST/PATCH — `Content-Type: application/json`
- **Аутентификация**: пока эндпоинты открыты (прототип). Связь с сессией
  Auth.js фронтенда — через `backendId` (см. «Как фронтенд получает
  пользователя» ниже). Guard'ы по ролям — следующий этап.
- **Ошибки**: стандартные коды (400 валидация, 404 не найдено) c JSON-телом
  `{ statusCode, message }`.

## Как фронтенд получает пользователя

При каждом входе (OTP / Google / педагог) колбэк `jwt` в `lib/auth.ts`
делает `POST /users` (upsert по `email`) и кладёт `id` из ответа в сессию
как `session.user.backendId`. Клиентские компоненты получают его через
`backendUserId()` из `lib/api.ts`, серверные — из `auth()`.

---

## Tests — тесты и попытки

| Метод | Путь | Тело / параметры | Описание |
|---|---|---|---|
| GET | `/tests` | — | Список тестов (`slug`: debruce, mbti, holland) с числом вопросов |
| GET | `/tests/:id` | — | Тест с вопросами и вариантами ответов (по порядку) |
| POST | `/tests/:id/attempts` | `{ userId }` | Начать попытку (UserTest, state=STARTED) |
| GET | `/attempts/:id` | — | Попытка с ответами |
| PATCH | `/attempts/:id` | `{ currentQuestion?, state?, result? }` | Прогресс/завершение; `state:"FINISHED"` проставляет `finished` |
| POST | `/attempts/:id/answers` | `{ questionId, answerIds[] }` | Ответ на вопрос (повторный вызов перезаписывает выбор) |
| GET | `/users/:userId/attempts` | — | История попыток пользователя (новые сверху) |

`result` — произвольный JSON; фронтенд пишет `{ summary, ... }`
(например `{ summary: "ENFJ · Протагонист", type: "ENFJ" }`).

## Profile — пользователи, организации, география

| Метод | Путь | Тело / параметры | Описание |
|---|---|---|---|
| GET | `/users` | — | Все пользователи |
| GET | `/users/:id` | — | Пользователь с организацией и дипломами |
| POST | `/users` | `{ name, surname?, email, grade?, language?, photoUrl?, role?, organizationId? }` | **Upsert по email** — повторный вызов возвращает существующего |
| PATCH | `/users/:id` | поля профиля | Обновить профиль |
| GET | `/organizations` | — | Организации (школы) со счётчиком учеников |
| GET | `/organizations/:id` | — | Организация: город, владелец, администраторы |
| POST | `/organizations` | `{ name, cityId?, ownerUserId? }` | Создать организацию |
| POST | `/organizations/:id/admins` | `{ userId }` | Назначить администратора |
| GET | `/regions` | — | Регионы с городами |
| POST | `/regions` | `{ name }` | Создать регион |
| POST | `/cities` | `{ name, regionId }` | Создать город |
| GET | `/users/:id/diplomas` | — | Дипломы/сертификаты пользователя |
| POST | `/users/:id/diplomas` | `{ name, type: DIPLOMA\|CERTIFICATE, fileUrl? }` | Добавить (файл в S3 — след. этап) |
| DELETE | `/diplomas/:id` | — | Удалить |

## Navigator — вузы, колледжи, программы

Данные: 938 заведений (115 вузов, 716 колледжей, 107 зарубежных),
100 ГОП + 170 специальностей колледжей, ~9 200 связей.

| Метод | Путь | Параметры | Описание |
|---|---|---|---|
| GET | `/navigator/industries` | — | 15 отраслей со счётчиком программ |
| GET | `/navigator/institutions` | `type` (UNIVERSITY\|COLLEGE\|INTERNATIONAL), `city`, `q`, `dorm`, `maxPrice`, `page`, `pageSize` | Каталог заведений с пагинацией `{ total, page, pageSize, items }` |
| GET | `/navigator/institutions/:id` | — | Заведение с программами (цены, языки, места, экзамены) |
| GET | `/navigator/programs` | `level` (BACHELOR\|COLLEGE), `q`, `industryId` | Каталог программ |
| GET | `/navigator/programs/:code` | — | Программа (ГОП `B047` или код `05320100`) со списком заведений |

## Chat — AI-чат

| Метод | Путь | Тело / параметры | Описание |
|---|---|---|---|
| POST | `/chats` | `{ userId, chatType: MAIN_STUDENT\|MAIN_TEACHER\|CORNER_STUDENT, name? }` | Создать чат |
| GET | `/chats?userId=` | — | Чаты пользователя |
| GET | `/chats/:id/messages` | — | История сообщений |
| POST | `/chats/:id/messages` | `{ text }` | Сообщение пользователя → ответ: `{ userMessage, assistantMessage }`. Ответ ассистента пока каноничный демо-текст; здесь подключается Claude API |

## Course — курс педагога

| Метод | Путь | Тело / параметры | Описание |
|---|---|---|---|
| GET | `/manuals` · `/manuals/:id` | — | Гайды-руководства |
| GET | `/courses` | — | Курсы |
| GET | `/courses/:id` | — | Курс целиком: модули → уроки + квизы с вопросами |
| POST | `/courses/:id/enroll` | `{ userId }` | Записаться (idempotent) |
| GET | `/users/:userId/courses` | — | Прогресс: записи, модули, уроки |
| PUT | `/user-courses/:id/lessons/:lessonId` | `{ state: STARTED\|FINISHED }` | Отметить урок |
| PUT | `/user-courses/:id/modules/:moduleId` | `{ state }` | Отметить модуль |
| POST | `/quizzes/:id/attempts` | `{ userId, answers: [{ quizQuestionId, quizAnswerIds[], value? }] }` | Сдать квиз; ответ содержит `result: { correct, total, passed }` (порог 70%, эталон — `correct: true` в content ответа; открытые вопросы не автопроверяются) |
| GET | `/users/:userId/quizzes` | — | История сдач |

## Achievements — достижения и бонусная система

| Метод | Путь | Тело / параметры | Описание |
|---|---|---|---|
| GET | `/achievements/student` | — | 9 шагов чек-листа ученика (по `order`) |
| GET | `/users/:id/achievements` | — | Чек-лист с отметками пользователя (`isSuccess`, `achievedAt`) |
| POST | `/users/:id/achievements/:achievementId` | — | Отметить шаг выполненным (upsert) |
| GET | `/achievements/org` | — | Значки школы (7 значков сезона) |
| GET | `/org-log-types` | — | 22 типа начислений: `name`, `point`, `group` (STUDENTS/REACH/REPORT/LEARN/CONSISTENCY) |
| POST | `/org-logs` | `{ userId, orgLogTypeId, text? }` | Начислить баллы (журнал) |
| GET | `/users/:id/org-logs` | — | Журнал начислений педагога |
| GET | `/organizations/:id/points` | — | Сумма баллов сезона: `{ total, byGroup, entries }` |
