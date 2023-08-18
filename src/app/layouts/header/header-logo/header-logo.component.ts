import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header-logo',
  templateUrl: './header-logo.component.html',
  styleUrls: ['./header-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderLogoComponent {
  @Input() shrink = false;

  get siteTitle(): string {
    return environment.siteInfo.title;
  }

  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigateByUrl('/').then();
  }

  protected readonly alert = alert;
}
