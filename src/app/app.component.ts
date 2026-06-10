import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { APP_ENVIRONMENT } from './core/config/environment.token';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly env = inject(APP_ENVIRONMENT);

  ngOnInit(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.classList.add(`theme-${this.env.name}`);
  }
}
