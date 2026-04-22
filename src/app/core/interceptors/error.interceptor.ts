import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred. Please try again.';

      if (error.error?.error?.message) {
        message = error.error.error.message;
      } else if (error.status === 0) {
        message = 'Network error. Please check your connection and try again.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status === 429) {
        message = 'Too many requests. Please slow down and try again shortly.';
      } else if (error.status >= 500) {
        message = 'Server error. We have been notified. Please try again later.';
      }

      return throwError(() => ({ ...error, userMessage: message }));
    }),
  );
};
