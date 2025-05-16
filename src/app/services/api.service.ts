import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // works in standalone apps too
})
export class ApiService {
  private baseUrl = 'https://951c-117-254-215-10.ngrok-free.app';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/items`);
  }

  postItem(item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, item);
  }
}
