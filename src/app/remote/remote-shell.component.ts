import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const CLOUDBERRY_THEME_BODY_CLASSES = [
  'theme-prod',
  'theme-dev',
  'theme-test',
  'theme-lt',
  'theme-preprod',
] as const;

@Component({
  selector: 'app-cloudberry-remote-shell',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: ':host { display: block; min-height: 0; }',
})
export class RemoteShellComponent implements OnDestroy {
  ngOnDestroy(): void {
    document.body.classList.remove(...CLOUDBERRY_THEME_BODY_CLASSES);
  }
}
