import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header-operation',
  templateUrl: './header-operation.component.html',
  styleUrls: ['./header-operation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderOperationComponent {}
