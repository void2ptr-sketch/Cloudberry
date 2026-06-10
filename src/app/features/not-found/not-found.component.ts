import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppRoutePath } from '../../core/routing/app-route-paths';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  readonly dashboardPath = ['/', AppRoutePath.dashboard];
}
