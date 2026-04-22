import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse, OrderStatus, OrderSummaryResponse } from '../../core/models/order.model';
import { PageResponse } from '../../core/models/page.model';

@Injectable({ providedIn: 'root' })
export class OrderApiService {

  constructor(private readonly http: HttpClient) {}

  // Client endpoints
  getMyOrders(status?: OrderStatus, page = 0, size = 10): Observable<PageResponse<OrderSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<OrderSummaryResponse>>('/api/orders', { params });
  }

  getMyOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`/api/orders/${id}`);
  }

  createOrder(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/api/orders', request);
  }

  updateOrder(id: number, request: OrderRequest): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`/api/orders/${id}`, request);
  }

  submitOrder(id: number): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/orders/${id}/submit`, {});
  }

  cancelOrder(id: number): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/orders/${id}/cancel`, {});
  }

  // Manager endpoints
  getAllOrders(status?: OrderStatus, page = 0, size = 10): Observable<PageResponse<OrderSummaryResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<OrderSummaryResponse>>('/api/manager/orders', { params });
  }

  getOrderDetail(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`/api/manager/orders/${id}`);
  }

  approveOrder(id: number): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/manager/orders/${id}/approve`, {});
  }

  declineOrder(id: number, reason?: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`/api/manager/orders/${id}/decline`, { reason });
  }
}
