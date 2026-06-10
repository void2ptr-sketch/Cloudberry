import { Component } from '@angular/core';

import { UiTranslatePipe } from '../../shared/ui-locale';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [UiTranslatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {}
