# Cloudberry

**Cloud accounting for clouds** — SPA для учёта затрат на облачную инфраструктуру (FinOps): дашборд расходов, подключения к провайдерам, бюджеты с алертами, профиль пользователя.

Подробнее о продукте: [docs/DOMAIN.md](docs/DOMAIN.md).

## Стек

| Слой | Технологии |
| --- | --- |
| Framework | [Angular 17](https://angular.dev) — standalone-компоненты, без NgModule |
| Язык | TypeScript 5.2, доменные модели через `type` (не `interface`) |
| Состояние | [Signals](https://angular.dev/guide/signals) — `AppStore` (`signal` + `computed`) |
| HTTP | `HttpClient` + functional interceptors (auth, ошибки); RxJS только в `core/api/` |
| Формы | Reactive Forms |
| Стили | SCSS, без UI-библиотек |
| i18n | `@angular/localize` — `i18n` / `$localize`, runtime `loadTranslations` (ru / en / zh) |
| Тесты | Karma, Jasmine; smoke-тесты в `src/app/smoke/` |
| Качество | ESLint (`angular-eslint`), Prettier |

Бэкенд в репозитории не входит; REST API ожидается на `environment.apiUrl` (по умолчанию `http://localhost:3000/api`).

## Быстрый старт

```bash
npm install
npm start
```

Приложение: [http://localhost:4200/](http://localhost:4200/). В DEV включены mock-данные (`enableDebug: true`), HTTP к API не обязателен.

Локальные секреты — в `.env` (шаблон: [.env.example](.env.example), файл в `.gitignore`).

## Скрипты

| Команда | Описание |
| --- | --- |
| `npm start` | Dev-сервер (конфигурация **development**) |
| `npm run dev` | Алиас для `npm start` |
| `npm run start:test` | Dev-сервер с конфигурацией **test** |
| `npm run build` | Production-сборка → `dist/cloudberry` |
| `npm run build:dev` | Сборка **development** |
| `npm run build:test` | Сборка **test** |
| `npm test` | Unit-тесты (watch) |
| `npm run test:ci` | Все тесты, ChromeHeadless |
| `npm run test:smoke` | Smoke-тесты критичных сценариев |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint с автоисправлением |
| `npm run format` | Prettier — записать |
| `npm run format:check` | Prettier — проверка |
| `npm run audit` | Проверка уязвимостей зависимостей |
| `npm run audit:fix` | `npm audit fix` (без breaking changes) |

## Окружения

Файлы в `src/environments/`, подстановка через `fileReplacements` в `angular.json`:

| Конфигурация | Файл | `enableDebug` | Назначение |
| --- | --- | --- | --- |
| development | `environment.development.ts` | `true` | Локальная разработка, mock-данные |
| test | `environment.test.ts` | `true` | Тестовый билд / serve |
| production | `environment.production.ts` | `false` | Prod, загрузка с API |

Токен `APP_ENVIRONMENT` — `src/app/core/config/environment.token.ts`.

## Структура проекта

```
src/app/
├── core/                    # Singleton-слой приложения
│   ├── api/                 # HTTP-сервисы, типы ответов API, readHttpResource()
│   ├── i18n/                # @angular/localize, каталоги en/zh, переключатель языка
│   ├── config/              # environment.token
│   ├── domain/              # Доменные типы (Budget, CloudConnection, …)
│   ├── http/                # Auth/error interceptors, AuthTokenService
│   ├── layout/              # App shell: шапка, навигация, footer
│   ├── routing/             # Пути и пункты меню
│   ├── sanitize/            # Санитизация доменного ввода
│   ├── state/               # AppStore, resource states (loading/error)
│   └── storage/             # localStorage для connections, budgets
├── features/                # Пользовательские сценарии (lazy routes)
│   ├── dashboard/
│   ├── connections/
│   ├── budgets/
│   ├── user-profile/
│   ├── reports/             # заглушка MVP
│   ├── costs/               # заглушка MVP
│   └── not-found/
├── shared/
│   ├── sanitize/            # Валидаторы и утилиты очистки текста
│   └── ui-resource-status/  # Индикатор загрузки / ошибки / retry
├── smoke/                   # Smoke-тесты (роутинг, mock-данные, i18n)
├── app.config.ts            # providers: HttpClient, interceptors, router
└── app.routes.ts
docs/                        # DOMAIN.md, MODELS.md, STATE.md
```

### Маршруты (MVP)

| Путь | Фича |
| --- | --- |
| `/dashboard` | Дашборд (главная после редиректа с `/`) |
| `/connections` | Подключения к облакам |
| `/budgets` | Бюджеты и пороги 80% / 100% |
| `/profile` | Профиль пользователя |
| `/reports` | Отчёты (заглушка) |
| `/costs` | Детализация расходов (заглушка) |

## Документация

| Файл | Содержание |
| --- | --- |
| [docs/DOMAIN.md](docs/DOMAIN.md) | Домен, роли, границы MVP |
| [docs/MODELS.md](docs/MODELS.md) | Типы данных и API-модели |
| [docs/STATE.md](docs/STATE.md) | AppStore, signals, правила RxJS |

## CI

На каждый `push` и `pull_request` запускается [GitHub Actions](.github/workflows/ci.yml):

1. `npm ci`
2. `npm run build` (production)
3. `npm run test:ci` (ChromeHeadlessCI)

## Линт и форматирование

```bash
npm run lint
npm run format:check
```

Перед коммитом рекомендуется `npm run test:ci` и `npm run build`.
