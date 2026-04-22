import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { User, UserType } from '@core/models';
import { environment } from '@env/environment';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
}

const keys = environment.storageKeys;

function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem(keys.authToken);
    const refreshToken = localStorage.getItem(keys.refreshToken);
    const userJson = localStorage.getItem(keys.user);
    return {
      token,
      refreshToken,
      user: userJson ? (JSON.parse(userJson) as User) : null,
    };
  } catch {
    // localStorage can throw in private browsing or if storage is full
    return { token: null, refreshToken: null, user: null };
  }
}

const OWNER_TYPES: UserType[] = ['owner', 'agent', 'agency_admin', 'platform_admin', 'super_admin'];
const ADMIN_TYPES: UserType[] = ['platform_admin', 'super_admin'];

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(loadInitialState()),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.token() && !!store.user()),
    fullName: computed(() => {
      const u = store.user();
      return u ? `${u.first_name} ${u.last_name}`.trim() : '';
    }),
    // Can list/manage their own properties
    isOwnerOrAgent: computed(() => {
      const t = store.user()?.user_type;
      return t ? OWNER_TYPES.includes(t) : false;
    }),
    isAdmin: computed(() => {
      const t = store.user()?.user_type;
      return t ? ADMIN_TYPES.includes(t) : false;
    }),
    avatarUrl: computed(() => store.user()?.avatar_url ?? null),
  })),
  withMethods((store) => ({
    setCredentials(credentials: { token: string; refreshToken: string; user: User }): void {
      patchState(store, {
        token: credentials.token,
        refreshToken: credentials.refreshToken,
        user: credentials.user,
      });
      localStorage.setItem(keys.authToken, credentials.token);
      localStorage.setItem(keys.refreshToken, credentials.refreshToken);
      localStorage.setItem(keys.user, JSON.stringify(credentials.user));
    },
    updateUser(user: User): void {
      patchState(store, { user });
      localStorage.setItem(keys.user, JSON.stringify(user));
    },
    logout(): void {
      patchState(store, { token: null, refreshToken: null, user: null });
      localStorage.removeItem(keys.authToken);
      localStorage.removeItem(keys.refreshToken);
      localStorage.removeItem(keys.user);
    },
  })),
);
