import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { User } from '@core/models';
import { AuthStore } from '@state/auth.store';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type?: string;
  preferred_language?: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/public/auth/login', payload).pipe(
      map((res) => {
        const data = res.data as AuthResponse;
        this.authStore.setCredentials({ token: data.accessToken, refreshToken: data.refreshToken, user: data.user });
        return data;
      }),
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/public/auth/register', payload).pipe(
      map((res) => {
        const data = res.data as AuthResponse;
        this.authStore.setCredentials({ token: data.accessToken, refreshToken: data.refreshToken, user: data.user });
        return data;
      }),
    );
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<void> {
    return this.api.post<void>('/public/auth/forgot-password', payload).pipe(map(() => undefined));
  }

  resetPassword(payload: ResetPasswordPayload): Observable<void> {
    return this.api.post<void>('/public/auth/reset-password', payload).pipe(map(() => undefined));
  }
}
