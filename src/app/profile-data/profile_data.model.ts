export interface masterDataProps {
  id: number;
  name: string;
}

export interface MasterListDataProps {
  response: {
    code: number;
    msg: string;
  };
  data: [masterDataProps];
}

export interface userdataprops {
  emp_id: number;
  f_name: string;
  l_name: string;
  designation_id: number;
  user_name: string;
  password: string;
  is_active: number;
  mobile_number: number;
  circle_id: number;
  circle_name: string;
  division_id: number;
  designation_name:string
  division_name: string;
  range_id: number;
  range_name: string;
  beat_id: number;
  sub_division_id: number;
  sub_division_name: string;
  is_self_verified: number;
}


export interface GetCastAndCrimTypeMasterResponse {
    response: SuccessResponse,
    crim_type_data: GetCastAndCrimTypeMasterResponseModal[],
    cast_data: GetCastAndCrimTypeMasterResponseModal[]

}

export interface SuccessResponse {
    code: number,
    msg: string
}

export interface GetCastAndCrimTypeMasterResponseModal {
    id: number,
    name: string
}

export interface SubmitProfileRequestModel{
    empId:string,
    circleId:string,
    divisionId:string,
    subDivisionId:string,
    rangId:string,
    beatId:string
}