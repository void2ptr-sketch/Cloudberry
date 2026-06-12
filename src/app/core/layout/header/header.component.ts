import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LocaleSwitcherComponent } from '../../i18n';
import { UserProfileService } from '../../../features/user-profile/user-profile.service';
import { AppRoutePath } from '../../routing/app-route-paths';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive, MatToolbarModule, LocaleSwitcherComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly userProfileService = inject(UserProfileService);

  readonly homeLink = ['/', AppRoutePath.dashboard];
  readonly profileLink = ['/', AppRoutePath.profile];
  readonly displayName = this.userProfileService.displayName;
}
