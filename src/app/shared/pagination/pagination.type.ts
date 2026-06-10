export type PaginationOptions = {
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
};

export type PaginationSlice<T> = {
  items: readonly T[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
};
