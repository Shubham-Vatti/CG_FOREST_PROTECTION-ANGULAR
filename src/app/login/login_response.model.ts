export interface LoginResponseModel {
  response: {
    code: number;
    msg: string;
  };
  data: [
    {
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
      division_name: string;
      range_id: number;
      range_name: string;
      beat_id: number;
      sub_division_id: number;
      sub_division_name: string;
      is_self_verified: number;
    }
  ];
}

export interface LoginRequestModel {
  mobile: string;
  password: string;
}

export interface UserLoginResponse {
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
  division_name: string;
  range_id: number;
  range_name: string;
  beat_id: number;
  sub_division_id: number;
  sub_division_name: string;
  is_self_verified: number;
}
