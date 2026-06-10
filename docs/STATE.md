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
- **PROD** — `AppStore.loadBillingData()` вызывает API и пишет в signals.

В компонентах:

```typescript
private readonly store = inject(AppStore);
readonly costSummary = this.store.costSummary;
```

Не:

```typescript
this.http.get(...).subscribe(...); // ❌
```

## ESLint

Импорт `rxjs` / `rxjs/operators` вне `core/api` запрещён правилом `no-restricted-imports`.
