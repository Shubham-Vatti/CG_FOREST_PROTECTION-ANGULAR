import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginResponseModel } from '../login/login_response.model';
import {
  GetCastAndCrimTypeMasterResponse,
  MasterListDataProps,
  SubmitProfileRequestModel,
} from '../profile-data/profile_data.model';
import { GetStateNameResponseModel } from './GetStateNameResponse.model';
import { GetMastersResponse } from '../pages/por-form/por-form.model';
import { PORFormListProps } from '../pages/por-form-list/por-form-list.model';

@Injectable({
  providedIn: 'root', // works in standalone apps too
})
export class ApiService {
  private baseUrl = 'https://03c4de541d17.ngrok-free.app';
  private User_Login_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/login_employee`;
  private Get_Circle_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getCircle`;
  private Get_Divison_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getDivision`;
  private Get_SubDivision_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getSubDivision`;
  private Get_Range_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getRange`;
  private Get_Beat_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getBeat`;
  private Get_CastNDCrime_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/get_master`;
  private apiUrlToGetGoogleAddress: string = `https://nominatim.openstreetmap.org/reverse`;
  private apiUrlSubmitComplainData: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/submitComplain`;
  private Profile_update_Url: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/selfVerified`;
  private Complain_List_Url: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getComplainList`;

  constructor(private http: HttpClient) {}

  async User_Login(data: object): Promise<Observable<LoginResponseModel>> {
    console.log('--data--', JSON.stringify(data));
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<LoginResponseModel>(this.User_Login_Url, JSON.stringify(data), {
        headers,
      })
      .pipe(
        map((response) => {
            return response as LoginResponseModel;
        }),
        catchError(this.handleError)
      );
  }

  async Get_Circle_Data(): Promise<Observable<MasterListDataProps>> {
    return this.http.post<MasterListDataProps>(this.Get_Circle_Url, null).pipe(
      map((response) => {
        console.log('--inside-resp--', response);
        if (response.response.code === 200) {
          return response as MasterListDataProps;
        } else {
          throw new Error(`Unexpected status code: ${response.response.code}`);
        }
      }),
      catchError(this.handleError)
    );
  }

  async Get_Division_Data(
    data?: string | null
  ): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<MasterListDataProps>(this.Get_Divison_Url, data,{headers:headers}).pipe(
      map((response) => {
        console.log('--inside-resp--', response);
        if (response.response.code === 200) {
          return response as MasterListDataProps;
        } else {
          throw new Error(`Unexpected status code: ${response.response.code}`);
        }
      }),
      catchError(this.handleError)
    );
  }

  async Get_Sub_Division_Data(data?:string|null): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<MasterListDataProps>(this.Get_SubDivision_Url, data,{headers:headers})
      .pipe(
        map((response) => {
          console.log('--inside-resp--', response);
          if (response.response.code === 200) {
            return response as MasterListDataProps;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  async Get_Range_Data(data?:string|null): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<MasterListDataProps>(this.Get_Range_Url, data,{headers:headers}).pipe(
      map((response) => {
        console.log('--inside-resp--', response);
        if (response.response.code === 200) {
          return response as MasterListDataProps;
        } else {
          throw new Error(`Unexpected status code: ${response.response.code}`);
        }
      }),
      catchError(this.handleError)
    );
  }

  async Get_Beat_Data(data?:string|null): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<MasterListDataProps>(this.Get_Beat_Url, data,{headers}).pipe(
      map((response) => {
        console.log('--inside-resp--', response);
        if (response.response.code === 200) {
          return response as MasterListDataProps;
        } else {
          throw new Error(`Unexpected status code: ${response.response.code}`);
        }
      }),
      catchError(this.handleError)
    );
  }

  
  async Get_Complain_List_Data(data?:string|null): Promise<Observable<PORFormListProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<PORFormListProps>(this.Complain_List_Url, data,{headers}).pipe(
      map((response) => {
        console.log('--inside-resp--', response);
        if (response.response.code === 200) {
          return response as PORFormListProps;
        } else {
          throw new Error(`Unexpected status code: ${response.response.code}`);
        }
      }),
      catchError(this.handleError)
    );
  }

  submitProfilData(body: string): Observable<GetMastersResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<GetMastersResponse>(this.Profile_update_Url, body, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          if (response.response.code === 200) {
            return response as GetMastersResponse;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );

  }

  // GET GOOGLE ADDRESS PROGRAMATICALLY
  getGoogleAddress(
    lat: number,
    lng: number
  ): Observable<GetStateNameResponseModel> {
    // console.log("APIUrl", this.apiUrlToGetGoogleAddress + "?lat=" + lat.toString() + "&lon=" + lng.toString() + "&format=json");

    return this.http
      .get<GetStateNameResponseModel>(
        this.apiUrlToGetGoogleAddress +
          '?lat=' +
          lat.toString() +
          '&lon=' +
          lng.toString() +
          '&format=json'
      )
      .pipe(
        catchError((error) => {
          throw new Error('Error logging in');
        })
      );
  }
  // Get Cast And Crim Master
  getCastAndCrimMaster(): Observable<GetCastAndCrimTypeMasterResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<GetCastAndCrimTypeMasterResponse>(this.Get_CastNDCrime_Url, null, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          if (response.response.code === 200) {
            return response as GetCastAndCrimTypeMasterResponse;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  submitCrimData(formformData: FormData): Observable<GetMastersResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<GetMastersResponse>(this.apiUrlSubmitComplainData, formformData, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          if (response.response.code === 200) {
            return response as GetMastersResponse;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  Get_Data_Api(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  // postItem(url:string,item: object|null): Observable<any> {
  //   return this.http.post(`${this.baseUrl}+${url}`, item);
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend/server error
      alert(error?.error.title);
      console.error(
        `Server returned code ${error.status}, body was:`,
        error?.error.title
      );
    }
    return throwError(
      () => new Error('Something went wrong. Please try again later.')
    );
  }
}
