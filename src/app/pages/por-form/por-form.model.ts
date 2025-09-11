export interface GetMastersResponse {
  response: SuccessResponse;
  data: MastersResponseModel[];
}

export interface SuccessResponse {
  code: number;
  msg: string;
}

export interface MastersResponseModel {
  id: number;
  name: string;
}

export interface AssignRAResponseModel {
  response: {
    code: number;
    msg: string;
  };
}

export interface MasterWorkLogModel {
  response: {
    code: number;
    msg: string;
  };
}
