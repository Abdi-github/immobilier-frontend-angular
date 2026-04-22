import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { DashboardStats, Property, Lead, Favorite, Alert, User } from '@core/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(ApiService);

  getStats(): Observable<DashboardStats> {
    return this.api.get<DashboardStats>('/dashboard/stats').pipe(map((r) => r.data));
  }

  getFavorites(): Observable<Favorite[]> {
    return this.api.getList<Favorite>('/dashboard/favorites').pipe(map((r) => r.data ?? []));
  }

  removeFavorite(propertyId: string): Observable<void> {
    return this.api.delete<void>(`/dashboard/favorites/${propertyId}`).pipe(map(() => undefined));
  }

  addFavorite(propertyId: string): Observable<void> {
    return this.api.post<void>('/dashboard/favorites', { property_id: propertyId }).pipe(map(() => undefined));
  }

  getAlerts(): Observable<Alert[]> {
    return this.api.getList<Alert>('/dashboard/alerts').pipe(map((r) => r.data ?? []));
  }

  createAlert(data: Partial<Alert>): Observable<Alert> {
    return this.api.post<Alert>('/dashboard/alerts', data).pipe(map((r) => r.data));
  }

  deleteAlert(id: string): Observable<void> {
    return this.api.delete<void>(`/dashboard/alerts/${id}`).pipe(map(() => undefined));
  }

  getMyProperties(): Observable<Property[]> {
    return this.api.getList<Property>('/dashboard/properties').pipe(map((r) => r.data ?? []));
  }

  getInquiries(): Observable<Lead[]> {
    return this.api.getList<Lead>('/dashboard/inquiries').pipe(map((r) => r.data ?? []));
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.api.put<User>('/dashboard/profile', data).pipe(map((r) => r.data));
  }
}
