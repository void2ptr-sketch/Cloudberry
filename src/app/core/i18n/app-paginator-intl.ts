import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

function paginationRangeLabel(page: number, pageSize: number, length: number): string {
  if (length === 0 || pageSize === 0) {
    return $localize`:@@pagination.rangeEmpty:0 из ${length}`;
  }

  const total = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex =
    startIndex < total ? Math.min(startIndex + pageSize, total) : startIndex + pageSize;

  return $localize`:@@pagination.range:${startIndex + 1} – ${endIndex} из ${total}`;
}

@Injectable()
export class AppPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:@@pagination.itemsPerPage:Элементов на странице:`;
    this.nextPageLabel = $localize`:@@pagination.nextPage:Следующая страница`;
    this.previousPageLabel = $localize`:@@pagination.previousPage:Предыдущая страница`;
    this.firstPageLabel = $localize`:@@pagination.firstPage:Первая страница`;
    this.lastPageLabel = $localize`:@@pagination.lastPage:Последняя страница`;
    this.getRangeLabel = paginationRangeLabel;
  }
}
