import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from 'ng-devui';

import { AuthService } from './auth.service';
import { CONFIG } from '../config';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!authService.isUserLoggedIn()) {
    toastService.open({
      value: [
        {
          severity: 'info',
          summary: '提示',
          content: '请先登录'
        }
      ],
      life: 2000
    });
    router.navigate([CONFIG.loginUrl]).then();
    return false;
  }
  return true;
};
