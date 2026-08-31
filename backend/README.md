# Smart Bolashaq — Backend

NestJS + Prisma + PostgreSQL. Шесть модулей по ERD: **tests**, **profile**,
**navigator**, **chat**, **course**, **achievements**.

## Запуск

```bash
cd backend
cp .env.example .env          # при необходимости поправить DATABASE_URL
docker compose up -d          # Postgres 16 на localhost:5434
npm install
npx prisma migrate deploy     # применить миграции (dev: npx prisma migrate dev)
npm run seed                  # реальные данные прототипа (938 заведений и т.д.)
npm run build && npm run start:prod   # API на http://localhost:3002
```

Дев-режим с перезагрузкой: `npm run dev`.

## API

- Базовый префикс: `http://localhost:3002/api`
- Swagger: `http://localhost:3002/api/docs`

Основные группы: `/tests`, `/attempts`, `/users`, `/organizations`,
`/regions`, `/navigator/*`, `/chats`, `/courses`, `/manuals`,
`/quizzes`, `/achievements/*`, `/org-logs`, `/org-log-types`.

## Данные (seed)

Сид берёт данные из фронтенда (репозиторий тот же):

- `lib/mock-data.ts` — 3 теста (DeBruce/MBTI/Holland) с вопросами и шкалой
  Ликерта, чек-лист достижений ученика;
- `lib/nav/*.json` — 938 заведений (вузы/колледжи/зарубежные), отрасли,
  ГОПы и специальности колледжей, ~9 200 связей «заведение ↔ программа»;
- `lib/course-module1.ts` — курс педагога: модуль, 6 уроков, итоговый квиз;
- `lib/teacher-mock-data.ts` — значки и типы начислений бонусной системы.

## Что осталось до прода

- Аутентификация: проверка сессии Auth.js из фронтенда (или JWKS),
  guard'ы по ролям — сейчас эндпоинты открыты.
- Чат: подключение LLM (Claude API) вместо заглушки в `chat.service.ts`.
- Файлы: загрузка дипломов/фото в S3-совместимое хранилище (`photoUrl`,
  `fileUrl` уже в схеме).
- Открытые вопросы квизов не автопроверяются (оцениваются вручную/LLM).
