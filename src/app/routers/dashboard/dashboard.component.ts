import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
