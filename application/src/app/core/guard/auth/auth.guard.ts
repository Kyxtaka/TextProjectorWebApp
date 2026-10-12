import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth-service';

export const authGuard: CanActivateFn = async (_, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.ensureAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};