import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { AppRoutePath } from '../../core/routing/app-route-paths';

@Component({
    selector: 'app-not-found',
    imports: [RouterLink, MatButtonModule, MatCardModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  readonly dashboardPath = [AppRoutePath.dashboard];
}
