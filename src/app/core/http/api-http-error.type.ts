export type ApiHttpError = {
  readonly kind: 'api-http';
  status: number;
  message: string;
  url: string;
};

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as ApiHttpError).kind === 'api-http'
  );
}
