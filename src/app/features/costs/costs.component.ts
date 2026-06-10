import { Component } from '@angular/core';

import { UiTranslatePipe } from '../../shared/ui-locale';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [UiTranslatePipe],
  templateUrl: './costs.component.html',
  styleUrl: './costs.component.scss',
})
export class CostsComponent {}
