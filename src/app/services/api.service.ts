import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CapacitorHttp } from '@capacitor/core';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://967c-117-254-215-10.ngrok-free.app/api'; // 🔹 Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // 🔹 Login API method (POST request)
  login(mobile: string, password: string): Observable<any> {
    const requestBody = { mobile, password };
    return this.http.post<any>(
      this.apiUrl + '/ForestComplainMonitoringSystem/login',
      requestBody
    );
  }

  GET_API_METHOD = async () => {
    const options = {
      url: 'https://example.com/my/api',
      headers: { 'X-Fake-Header': 'Fake-Value' },
      params: { size: 'XL' },
    };

    // or...
    // const response = await CapacitorHttp.request({ ...options, method: 'GET' })
  };
}
