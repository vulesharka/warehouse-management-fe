import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItemRequest, InventoryItemResponse } from '../../core/models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryApiService {

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<InventoryItemResponse[]> {
    return this.http.get<InventoryItemResponse[]>('/api/inventory');
  }

  getById(id: number): Observable<InventoryItemResponse> {
    return this.http.get<InventoryItemResponse>(`/api/inventory/${id}`);
  }

  create(request: InventoryItemRequest): Observable<InventoryItemResponse> {
    return this.http.post<InventoryItemResponse>('/api/inventory', request);
  }

  update(id: number, request: InventoryItemRequest): Observable<InventoryItemResponse> {
    return this.http.put<InventoryItemResponse>(`/api/inventory/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/inventory/${id}`);
  }
}
