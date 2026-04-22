import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@state/auth.store';
import { UserType } from '@core/models';

// Usage: canActivate: [roleGuard(['owner', 'agent', 'agency_admin'])]
export function roleGuard(allowedTypes: UserType[]): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }

    const userType = authStore.user()?.user_type;
    if (userType && allowedTypes.includes(userType)) {
      return true;
    }

    return router.createUrlTree(['/dashboard/profile']);
  };
}
