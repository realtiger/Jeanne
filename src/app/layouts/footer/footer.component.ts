import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  get siteInfo() {
    return environment.siteInfo;
  }
}
