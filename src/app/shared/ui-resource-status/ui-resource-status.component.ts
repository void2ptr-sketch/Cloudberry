import { Component, input, output } from '@angular/core';

import type { ResourceState } from '../../core/state/resource-state.type';
import type { UiMessageKey } from '../ui-locale';
import { UiTranslatePipe } from '../ui-locale';

@Component({
  selector: 'app-resource-status',
  standalone: true,
  imports: [UiTranslatePipe],
  templateUrl: './ui-resource-status.component.html',
  styleUrl: './ui-resource-status.component.scss',
})
export class UiResourceStatusComponent {
  readonly state = input.required<ResourceState>();
  readonly loadingKey = input<UiMessageKey>('common.loading');
  readonly retryable = input(true);
  readonly retry = output<void>();
}
