import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TruckRequest, TruckResponse } from '../../core/models/truck.model';
import { PageResponse } from '../../core/models/page.model';

@Injectable({ providedIn: 'root' })
export class TruckApiService {

  constructor(private readonly http: HttpClient) {}

  getAll(page = 0, size = 20): Observable<PageResponse<TruckResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<TruckResponse>>('/api/manager/trucks', { params });
  }

  create(request: TruckRequest): Observable<TruckResponse> {
    return this.http.post<TruckResponse>('/api/manager/trucks', request);
  }

  update(id: number, request: TruckRequest): Observable<TruckResponse> {
    return this.http.put<TruckResponse>(`/api/manager/trucks/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/manager/trucks/${id}`);
  }
}
