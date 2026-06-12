import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { APP_NAV_ITEMS } from '../../routing/app-nav-items';

@Component({
    selector: 'app-navigation',
    imports: [RouterLink, RouterLinkActive, MatListModule],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  readonly navItems = APP_NAV_ITEMS;
}
