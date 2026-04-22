import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Agency, Property, Pagination, Canton, City } from '@core/models';

export interface AgencyListParams extends Record<string, string | number | boolean | null | undefined> {
  page?: number;
  limit?: number;
  search?: string;
  canton_id?: string;
  city_id?: string;
  is_verified?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AgencyService {
  private readonly api = inject(ApiService);

  getAgencies(params: AgencyListParams = {}): Observable<{ items: Agency[]; pagination: Pagination }> {
    return this.api.getList<Agency>('/public/agencies', params).pipe(
      map((res) => ({ items: res.data ?? [], pagination: res.meta })),
    );
  }

  getAgencyById(id: string): Observable<Agency> {
    return this.api.get<Agency>(`/public/agencies/${id}`).pipe(map((res) => res.data));
  }

  getCantons(): Observable<Canton[]> {
    return this.api.getList<Canton>('/public/locations/cantons').pipe(
      map((res) => res.data ?? []),
    );
  }

  getCities(): Observable<City[]> {
    return this.api.getList<City>('/public/locations/cities').pipe(
      map((res) => res.data ?? []),
    );
  }

  getAgencyProperties(agencyId: string, params: { page?: number; limit?: number } = {}): Observable<{ items: Property[]; pagination: Pagination }> {
    return this.api.getList<Property>(`/public/agencies/${agencyId}/properties`, params).pipe(
      map((res) => ({ items: res.data ?? [], pagination: res.meta })),
    );
  }
}
