import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { APP_ENVIRONMENT } from '../../config/environment.token';

@Component({
    selector: 'app-footer',
    imports: [MatChipsModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private readonly env = inject(APP_ENVIRONMENT);

  readonly year = new Date().getFullYear();
  readonly showEnvBadge = this.env.enableDebug;
  readonly envLabel = this.env.name.toUpperCase();
}
