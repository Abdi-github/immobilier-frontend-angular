import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Property, PropertyImage, Category, Canton, City, ApiListResponse, Pagination } from '@core/models';
import { PropertyFilters } from '@state/search.store';

export interface PropertyListResult {
  items: Property[];
  pagination: Pagination;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly api = inject(ApiService);

  getProperties(filters: PropertyFilters): Observable<PropertyListResult> {
    return this.api.getList<Property>('/public/properties', { ...filters }).pipe(
      map((res) => ({
        items: res.data ?? [],
        pagination: res.meta,
      })),
    );
  }

  getPropertyById(id: string): Observable<Property> {
    return this.api.get<Property>(`/public/properties/${id}`).pipe(map((res) => res.data));
  }

  getPropertyImages(id: string): Observable<PropertyImage[]> {
    return this.api.get<PropertyImage[]>(`/public/properties/${id}/images`).pipe(
      map((res) => res.data ?? []),
    );
  }

  getCategories(): Observable<Category[]> {
    return this.api.getList<Category>('/public/categories').pipe(map((res) => res.data ?? []));
  }

  getCantons(): Observable<Canton[]> {
    return this.api.getList<Canton>('/public/locations/cantons').pipe(map((res) => res.data ?? []));
  }

  getCitiesByCanton(cantonId: string): Observable<City[]> {
    return this.api.getList<City>('/public/locations/cities', { canton_id: cantonId }).pipe(
      map((res) => res.data ?? []),
    );
  }

  // Submit a lead/inquiry for a property
  submitInquiry(propertyId: string, data: {
    contact_first_name: string;
    contact_last_name: string;
    contact_email: string;
    contact_phone?: string;
    inquiry_type: string;
    message: string;
    preferred_contact_method: string;
    preferred_language: string;
  }): Observable<void> {
    return this.api.post<void>(`/public/properties/${propertyId}/leads`, data).pipe(
      map(() => undefined),
    );
  }
}
