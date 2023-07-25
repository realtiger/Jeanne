import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MenuData } from '../../../types/global';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  @Input() data: MenuData[] = [];
}
