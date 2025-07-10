
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