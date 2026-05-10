# Тренажёр мнемотехники

Интерактивный тренажёр по книге «Мнемотехника» Зиганова и Козаренко. 8 уроков с теорией и упражнениями, флэш-карты и интерактивные тренажёры, история сессий и дашборд прогресса.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, routed at `/api`)
- `pnpm --filter @workspace/mnemonics run dev` — run the mnemonics frontend (port 20579, routed at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui + framer-motion + wouter
- API: Express 5 with generated OpenAPI types (Orval)
- DB: PostgreSQL + Drizzle ORM (only `sessions` table — lessons/exercises are static data)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — the OpenAPI spec (source of truth for types)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `lib/db/src/schema/sessions.ts` — only DB table (sessions)
- `artifacts/api-server/src/data/lessons.ts` — all 8 lessons with theory, exercises, topics
- `artifacts/api-server/src/data/exerciseContent.ts` — exercise content for each exercise type
- `artifacts/api-server/src/routes/` — API route handlers
- `artifacts/mnemonics/src/pages/` — frontend pages
- `artifacts/mnemonics/src/components/` — UI components

## Architecture decisions

- Lessons and exercise content are static data in the API server, not stored in the DB. Only user sessions (training results) are persisted.
- Exercise types: `chain`, `matryoshka`, `bpc-trainer`, `as100-flashcards`, `weekdays-flashcards`, `months`, `symbolization`, `foreign-words`, `dates`
- Flashcard types that exist in `/flashcards/:type`: `as100-flashcards`, `weekdays-flashcards`, `months`, `bpc-trainer`, `foreign-words`
- BPC trainer uses `numberList` (numbers to translate to letter codes)
- Flashcard vs trainer: exercises with types containing `flashcard` route to `/flashcards/:type`, others to `/exercises/:type`

## Product

8-lesson curriculum based on the Ziganov & Kozarenko mnemonics book:
1. Основы визуального мышления (Цепочка, Матрёшка)
2. БЦК — буквенно-цифровой код, метод Цицерона
3. Символизация и перекодирование по созвучию
4. Образные коды АС-100, запоминание дат
5. Расписания, числовые таблицы, дни недели
6. Формулы и тексты (метод сжатия)
7. Люди: имена, лица, телефоны
8. Иностранные слова через фонетические образы

## User preferences

- Russian language throughout
- No emojis in UI

## Gotchas

- Numbers with leading zeros (01, 09, 00) in TypeScript cause TS errors — use plain integers (1, 9, 0) in arrays
- OpenAPI spec: avoid endpoints that have both path params AND query params with the same operation ID stem — causes Orval TS2308 collision
- The mnemonics workflow occasionally takes longer to start — restart with `workflow_timeout: 90`
- Do NOT change `info.title` in OpenAPI spec — it controls generated filenames

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
