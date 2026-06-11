import { Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { LocaleSwitcherComponent } from '../i18n';
import { UserProfileService } from '../../features/user-profile/user-profile.service';
import { APP_ENVIRONMENT } from '../config/environment.token';
import { APP_NAV_ITEMS } from '../routing/app-nav-items';
import { AppRoutePath } from '../routing/app-route-paths';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatListModule,
    MatChipsModule,
    LocaleSwitcherComponent,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly userProfileService = inject(UserProfileService);

  readonly navItems = APP_NAV_ITEMS;
  readonly homeLink = ['/', AppRoutePath.dashboard];
  readonly profileLink = ['/', AppRoutePath.profile];
  readonly displayName = this.userProfileService.displayName;
  readonly year = new Date().getFullYear();
  readonly showEnvBadge = this.env.enableDebug;
  readonly envLabel = this.env.name.toUpperCase();
}
