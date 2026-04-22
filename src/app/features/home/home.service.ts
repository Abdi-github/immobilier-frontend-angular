import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Property, City, Canton, PopularCity, Agency, ApiListResponse } from '@core/models';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly api = inject(ApiService);

  getFeaturedProperties(): Observable<Property[]> {
    return this.api.getList<Property>('/public/properties', {
      status: 'PUBLISHED',
      limit: 6,
      sort_by: 'created_at',
      sort_order: 'desc',
    }).pipe(map((res) => res.data ?? []));
  }

  getPopularCities(): Observable<PopularCity[]> {
    return this.api.get<PopularCity[]>('/public/locations/cities/popular').pipe(
      map((res) => res.data ?? []),
    );
  }

  getCantons(): Observable<Canton[]> {
    return this.api.getList<Canton>('/public/locations/cantons', { limit: 50 }).pipe(
      map((res) => res.data ?? []),
    );
  }

  getFeaturedAgencies(): Observable<Agency[]> {
    return this.api.getList<Agency>('/public/agencies', {
      is_verified: true,
      limit: 4,
    }).pipe(map((res) => res.data ?? []));
  }
}
