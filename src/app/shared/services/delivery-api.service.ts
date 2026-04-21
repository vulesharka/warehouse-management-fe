import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableDaysResponse, DeliveryResponse, ScheduleDeliveryRequest } from '../../core/models/delivery.model';

@Injectable({ providedIn: 'root' })
export class DeliveryApiService {
  private readonly http = inject(HttpClient);

  getAvailableDays(orderId: number, days?: number): Observable<AvailableDaysResponse> {
    let params = new HttpParams();
    if (days != null) params = params.set('days', days);
    return this.http.get<AvailableDaysResponse>(`/api/manager/orders/${orderId}/available-days`, { params });
  }

  scheduleDelivery(orderId: number, request: ScheduleDeliveryRequest): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(`/api/manager/orders/${orderId}/schedule`, request);
  }
}
