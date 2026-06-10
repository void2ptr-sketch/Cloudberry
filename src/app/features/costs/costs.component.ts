import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './costs.component.html',
  styleUrl: './costs.component.scss',
})
export class CostsComponent {}
