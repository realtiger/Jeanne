import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagerComponent {}
