# Cloudberry

**Cloud accounting for clouds** — облачное приложение учёта затрат на инфраструктуру в публичных и частных облаках (FinOps): единая картина расходов, бюджеты, отчёты и распределение по командам/проектам.

Подробнее о домене, ролях и MVP: [docs/DOMAIN.md](docs/DOMAIN.md).

Standalone Angular-приложение (без NgModule).

## Скрипты

| Команда | Описание |
| --- | --- |
| `npm start` | Dev-сервер (http://localhost:4200/) |
| `npm run build` | Production-сборка в `dist/cloudberry` |
| `npm test` | Unit-тесты (Karma + Jasmine, watch) |
| `npm run test:ci` | Тесты один раз, ChromeHeadless |
| `npm run build:dev` | Сборка DEV |
| `npm run build:test` | Сборка TEST |
| `npm run start:test` | Dev-сервер с конфигом TEST |
| `npm run dev` | Алиас для `npm start` |

Окружения: `src/environments/` — **DEV**, **TEST**, **PROD** (`fileReplacements` в `angular.json`).

Перед первым запуском: `npm install`.

## Линт и форматирование

```bash
npm run lint          # ESLint (Angular)
npm run lint:fix      # ESLint с автоисправлением
npm run format        # Prettier — записать
npm run format:check  # Prettier — только проверка
```

## Структура

- `docs/DOMAIN.md` — описание домена и границ продукта
- `src/app/core/layout` — shell: шапка, навигация, контент, footer
- `src/app/core/state` — глобальное состояние (`AppStore`, signals)
- `src/app/core/api` — HTTP-слой (единственное место для RxJS)
- [docs/STATE.md](docs/STATE.md) — правила состояния и RxJS
- `src/app/core/domain` — доменные модели (`type`, см. [docs/MODELS.md](docs/MODELS.md))
- `src/app/core` — singleton-сервисы, guards, interceptors
- `src/app/shared` — переиспользуемые UI-компоненты
- `src/app/features` — фичи по домену (dashboard, budgets, connections, …)
