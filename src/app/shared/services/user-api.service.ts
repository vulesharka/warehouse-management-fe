import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRequest, UserResponse } from '../../core/models/user.model';
import { PageResponse } from '../../core/models/page.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly base = '/api/admin/users';

  constructor(private readonly http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<PageResponse<UserResponse>> {
    return this.http.get<PageResponse<UserResponse>>(this.base, {
      params: { page, size, sort: 'username,asc' }
    });
  }

  create(request: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.base, request);
  }

  update(id: number, request: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.base}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
