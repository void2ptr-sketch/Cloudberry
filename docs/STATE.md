# Состояние и RxJS

## Принцип

- **UI и бизнес-логика** — `AppStore` и **signals** (`signal`, `computed`).
- **RxJS** — только в `src/app/core/api/` для HTTP (и позже WebSocket).
- Компоненты **не** импортируют `rxjs` и **не** подписываются на `Observable`.

## Поток данных

```
HttpClient (Observable)
  → readHttpResource() → Promise
    → BillingApiService
      → AppStore.loadBillingData() → signal update
        → computed в компонентах
```

## Где что лежит

| Слой | Папка | RxJS |
| --- | --- | --- |
| HTTP / WS | `core/api/` | да |
| Глобальное состояние | `core/state/` | нет |
| Фичи | `features/*/` | нет |
| Layout | `core/layout/` | нет |

## Загрузка данных

- **DEV/TEST** (`enableDebug: true`) — mock в `AppStore`, без HTTP.
- **PROD** — `loadBillingData()`, `loadConnections()`, `loadBudgets()` вызывают API и пишут в signals.

### Состояния ресурсов (signals)

Для каждого HTTP-ресурса в `AppState.resources`:

| Ключ | Метод загрузки | Computed в store |
| --- | --- | --- |
| `billing` | `loadBillingData()` | `billingState` |
| `connections` | `loadConnections()` | `connectionsState` |
| `budgets` | `loadBudgets()` | `budgetsState` |

Тип `ResourceState`: `status` (`idle` \| `loading` \| `ready` \| `error`) + `error: string | null`.

В компонентах:

```typescript
private readonly store = inject(AppStore);
readonly billingState = this.store.billingState;
readonly costSummary = this.store.costSummary;
```

UI: `shared/ui-resource-status` — индикатор загрузки, ошибка и кнопка «Повторить».

Не:

```typescript
this.http.get(...).subscribe(...); // ❌
```

## ESLint

Импорт `rxjs` / `rxjs/operators` вне `core/api` запрещён правилом `no-restricted-imports`.
