# Модели данных

В проекте используются только **`type`**, не `interface`. Это проверяется ESLint (`@typescript-eslint/consistent-type-definitions`).

## Домен (`src/app/core/domain/`)

| Тип | Файл | Описание |
| --- | --- | --- |
| `CloudProviderId` | `cloud-provider.type.ts` | Идентификатор облачного провайдера |
| `CloudConnection` | `cloud-connection.type.ts` | Подключение billing-аккаунта |
| `CloudConnectionInput` | `cloud-connection-input.type.ts` | Форма создания / редактирования |
| `CostCenter` | `cost-center.type.ts` | Центр затрат (команда / продукт) |
| `CostRecord` | `cost-record.type.ts` | Нормализованная строка расхода |
| `UsageLine` | `usage-line.type.ts` | Сырая строка потребления |
| `Budget` | `budget.type.ts` | Бюджет на период |
| `BudgetAlert` | `budget.type.ts` | Срабатывание порога бюджета |
| `BudgetAlertThreshold` | `budget.type.ts` | `80` \| `100` (проценты) |
| `Report` | `report.type.ts` | Сводный отчёт |
| `ReportPeriod` | `report.type.ts` | Период отчёта |

Импорт:

```typescript
import type { CostRecord, Budget } from '../core/domain';
```

## Состояние приложения (`src/app/core/state/`)

| Тип | Описание |
| --- | --- |
| `AppState` | Полный снимок глобального store |
| `AppResources` | Состояния загрузки `billing`, `connections`, `budgets` |
| `ResourceState` | `status` + `error` для одного ресурса |
| `ResourceStatus` | `idle` \| `loading` \| `ready` \| `error` |
| `ReportingPeriod` | Период для фильтрации затрат |
| `CostSummary` | Агрегат по отфильтрованным `CostRecord` |

## API (`src/app/core/api/`)

Типы ответов и запросов — в `*.model.ts`, пути — в `api-endpoints.ts`.  
Пока JSON совпадает с доменом; при расхождении DTO остаются в `core/api`, маппинг — в сервисе.

| Тип | Эндпоинт | Описание |
| --- | --- | --- |
| `BillingSnapshot` | — | Снимок billing-данных (доменная форма) |
| `BillingSnapshotResponse` | `GET /billing/snapshot` | То же, тип ответа API |
| `ConnectionsListResponse` | `GET /connections` | Список подключений |
| `ConnectionResponse` | `POST/PUT /connections` | Одно подключение |
| `ConnectionRequest` | `POST/PUT /connections` | Тело запроса (= `CloudConnectionInput`) |
| `DeleteConnectionResponse` | `DELETE /connections/:id` | `void` (204) |
| `BudgetsListResponse` | `GET /budgets` | Список бюджетов |
| `BudgetResponse` | `POST/PUT /budgets` | Один бюджет |
| `BudgetRequest` | `POST/PUT /budgets` | Тело запроса (= `BudgetInput`) |
| `DeleteBudgetResponse` | `DELETE /budgets/:id` | `void` (204) |

## Окружение (`src/environments/`)

| Тип | Описание |
| --- | --- |
| `Environment` | `apiUrl`, `production`, `enableDebug`, … |
| `EnvironmentName` | `dev` \| `test` \| `prod` |

Секреты и локальные переопределения — в `.env` (в git не коммитятся). Шаблон: `.env.example` в корне репозитория.  
Сборка Angular по-прежнему использует `src/environments/*.ts`; в файлах окружения не хранить реальные ключи и токены.

## UI / routing

| Тип | Файл |
| --- | --- |
| `AppNavItem` | `app-nav-items.ts` |
| `AppRoutePath` | `app-route-paths.ts` |

## Правила

1. Новые сущности домена — отдельный `*.type.ts` и реэкспорт из `domain/index.ts`.
2. DTO API, отличающиеся от домена, — в `core/api/*.model.ts`.
3. Не дублировать доменные типы внутри `features/` — импортировать из `core/domain`.
