import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import type { Environment } from '../../../environments/environment.model';

export const APP_ENVIRONMENT = new InjectionToken<Environment>('APP_ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment,
});
