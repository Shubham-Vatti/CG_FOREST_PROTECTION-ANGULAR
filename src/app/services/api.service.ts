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
import {
  AssignRAResponseModel,
  GetMastersResponse,
  MasterWorkLogModel,
} from '../pages/por-form/por-form.model';
import { PORFormListProps } from '../pages/por-form-list/por-form-list.model';
import {
  RaListPropsData,
  RaWorkLogPropsData,
} from 'src/assets/models/reusable.model';

@Injectable({
  providedIn: 'root', // works in standalone apps too
})
export class ApiService {
  private baseUrl = 'https://forest.cg.gov.in/FOREST_COMPLAIN';
  private User_Login_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/login_employee`;
  private Get_Circle_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getCircle`;
  private Get_Divison_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getDivision`;
  private Get_SubDivision_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getSubDivision`;
  private Get_SubRange_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getSubRange`;
  private Get_Range_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getRange`;
  private Get_Beat_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getBeat`;
  private Get_CastNDCrime_Url = `${this.baseUrl}/api/ForestComplainMonitoringSystem/get_master`;
  private apiUrlToGetGoogleAddress: string = `https://nominatim.openstreetmap.org/reverse`;
  private apiUrlSubmitComplainData: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/submitComplain`;
  private Profile_update_Url: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/selfVerified`;
  private Complain_List_Url: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getComplainList`;
  private Ra_List_Url: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getRA`;
  private Assign_Ra_List_Url: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/assign_RA`;
  private submit_ra_worklog: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/submit_ra_log`;
  private get_ra_worklog: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getRAWorkLog`;
  private Get_Por_Filter: string = `${this.baseUrl}/api/ForestComplainMonitoringSystem/getPorReportAccordingToSelection`;

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

  async getRAList(data?: string | null): Promise<Observable<RaListPropsData>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<RaListPropsData>(this.Ra_List_Url, data, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          console.log('--inside-resp-RA-LIST--', response);
          if (response.response.code === 200) {
            return response as RaListPropsData;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  async getRAWorkLog(data?: object): Promise<Observable<RaWorkLogPropsData>> {
    console.log('--ra-work-log-body--', data);
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<RaWorkLogPropsData>(this.get_ra_worklog, data, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          console.log('--inside-resp-RA-LIST--', response);
          if (response.response.code === 200) {
            return response as RaWorkLogPropsData;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  async Get_Division_Data(
    data?: string | null
  ): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<MasterListDataProps>(this.Get_Divison_Url, data, {
        headers: headers,
      })
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

  async Get_Sub_Division_Data(
    data?: string | null
  ): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<MasterListDataProps>(this.Get_SubDivision_Url, data, {
        headers: headers,
      })
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

  async Get_Sub_Range_Data(
    data?: string | null
  ): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<MasterListDataProps>(this.Get_SubRange_Url, data, {
        headers: headers,
      })
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

  async Get_Range_Data(
    data?: string | null
  ): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<MasterListDataProps>(this.Get_Range_Url, data, { headers: headers })
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

  async Get_Beat_Data(
    data?: string | null
  ): Promise<Observable<MasterListDataProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<MasterListDataProps>(this.Get_Beat_Url, data, { headers })
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

  async Get_Complain_List_Data(
    data?: string | null
  ): Promise<Observable<PORFormListProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<PORFormListProps>(this.Complain_List_Url, data, { headers })
      .pipe(
        map((response) => {
          console.log('--inside-resp--', response);
          if (response.response.code === 200) {
            return response as PORFormListProps;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  async Get_Filter_Complain_List_Data(
    data?: string | null
  ): Promise<Observable<PORFormListProps>> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<PORFormListProps>(this.Get_Por_Filter, data, { headers })
      .pipe(
        map((response) => {
          console.log('--inside-resp--', response);
          if (response.response.code === 200) {
            return response as PORFormListProps;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
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

  AssignRA(body: string): Observable<AssignRAResponseModel> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<AssignRAResponseModel>(this.Assign_Ra_List_Url, body, {
        headers: headers,
      })
      .pipe(
        map((response) => {
          if (response.response.code === 200) {
            return response as AssignRAResponseModel;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  getGoogleAddress(
    lat: number,
    lng: number
  ): Observable<GetStateNameResponseModel> {
    return this.http
      .get<GetStateNameResponseModel>(
        this.apiUrlToGetGoogleAddress +
          '?lat=' +
          lat.toString() +
          '&lon=' +
          lng.toString() +
          '&format=json&accept-language=hi'
      )
      .pipe(
        catchError((error) => {
          throw new Error('Error logging in');
        })
      );
  }
  // Get Cast And Crim Master
  getCastAndCrimMaster(
    body: string
  ): Observable<GetCastAndCrimTypeMasterResponse> {
    console.log('--inside--getCastAndCrimMaster--', body);
    const headers = { 'Content-Type': 'application/json' };
    return this.http
      .post<GetCastAndCrimTypeMasterResponse>(this.Get_CastNDCrime_Url, body, {
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
    return this.http
      .post<GetMastersResponse>(this.apiUrlSubmitComplainData, formformData)
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

  async submitWorkLog(
    formformData: FormData
  ): Promise<Observable<MasterWorkLogModel>> {
    return this.http
      .post<MasterWorkLogModel>(this.submit_ra_worklog, formformData)
      .pipe(
        map((response) => {
          if (response.response.code === 200) {
            return response as MasterWorkLogModel;
          } else {
            throw new Error(
              `Unexpected status code: ${response.response.code}`
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend/server error
      alert(error?.error.title);
      console.error(
        `Server returned code ${error.status}, body was:`,
        error?.error?.title
      );
    }
    return throwError(
      () => new Error('Something went wrong. Please try again later.')
    );
  }
}
