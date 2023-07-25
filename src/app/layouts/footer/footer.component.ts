import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';
import { LayoutsService } from '../layouts.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnDestroy {
  config = this.layoutsService.getLayoutConfig().footer;
  configSubject$ = this.layoutsService.layoutSubject$.subscribe(config => (this.config = config.footer));

  get siteInfo() {
    return environment.siteInfo;
  }

  constructor(private layoutsService: LayoutsService) {}

  ngOnDestroy(): void {
    this.configSubject$.unsubscribe();
  }
}
