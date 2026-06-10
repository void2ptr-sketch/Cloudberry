import type { Budget, BudgetInput } from '../domain';

/** Request body: `POST /budgets`, `PUT /budgets/:id` */
export type BudgetRequest = BudgetInput;

/** Response body: `GET /budgets` */
export type BudgetsListResponse = Budget[];

/** Response body: `POST /budgets`, `PUT /budgets/:id` */
export type BudgetResponse = Budget;

/** Response body: `DELETE /budgets/:id` (204 No Content) */
export type DeleteBudgetResponse = void;
