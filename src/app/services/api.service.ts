import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginResponseModel } from '../login/login_response.model';

@Injectable({
  providedIn: 'root', // works in standalone apps too
})
export class ApiService {
  private baseUrl = 'https://898e-117-254-215-10.ngrok-free.app';
  private User_Login_Url=`${this.baseUrl}/api/ForestComplainMonitoringSystem/login`

  constructor(private http: HttpClient) {}



  User_Login(data: object): Observable<LoginResponseModel> {
    console.log('--data--',data)
    const headers={'Content-Type':"application/json"}
    return this.http.post<LoginResponseModel>(this.User_Login_Url, data,{headers}).pipe(
        map(response => {
          if (response.success.status_code === 200) {
            return response as LoginResponseModel;
          } else {
            alert('hii')
            throw new Error(`Unexpected status code: ${response.success.status_code}`);
          }
        }),
        catchError(this.handleError)
      );
    
  }



  Get_Data_Api(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  postItem(item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, item);
  }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend/server error
      console.error(`Server returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}

  