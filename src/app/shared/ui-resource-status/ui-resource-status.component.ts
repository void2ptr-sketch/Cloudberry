import { Component, input, output } from '@angular/core';

import type { ResourceState } from '../../core/state/resource-state.type';

@Component({
  selector: 'app-resource-status',
  standalone: true,
  templateUrl: './ui-resource-status.component.html',
  styleUrl: './ui-resource-status.component.scss',
})
export class UiResourceStatusComponent {
  readonly state = input.required<ResourceState>();
  readonly retryable = input(true);
  readonly retry = output<void>();
  readonly commonErrorLoad = $localize`:@@common.errorLoad:Ошибка загрузки данных`;
}
