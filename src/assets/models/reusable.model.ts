export interface EmployeeData {
  emp_id: number;
  f_name: string;
  l_name: string;
  designation_id: string;
  designation_name: string;
  circle_id: string;
  circle_name: string;
  division_id: string;
  division_name: string;
  sub_division_id: string;
  sub_division_name: string;
  range_id: string;
  range_name: string;
  sub_rang_id: string;
  sub_rang_name: string;
  beat_id: string;
  beat_name: string;
  password: string | null;
  unique_device_id: string;
}

export interface Cast {
  id: number;
  name: string;
}

export interface Beat {
  id: number;
  name: string;
  compartment_no: string[];
}

export interface CrimeType {
  id: number;
  name: string;
  dhara: string[];
}

export interface MasterDataProps {
  data: EmployeeData[];
  cast: Cast[];
  beat: Beat[];
  crimType: CrimeType[];
  dhara_data: [
    {
      id: string;
      dhara_head: string;
      dhara_comma_separated: string[];
      dhara_year: string;
    }
  ];
  prajati_name: [
    {
      id: number;
      name: string;
    }
  ];
}

export const designation_details = [
  {
    id: 1,
    name: 'CFO',
  },
  {
    id: 2,
    name: 'DFO',
  },
  {
    id: 3,
    name: 'SDO',
  },
  {
    id: 4,
    name: 'RO',
  },
  {
    id: 5,
    name: 'BG',
  },
];

export interface RaListPropsData {
  response: {
    code: number;
    msg: string;
  };
  data: [
    {
      emp_id: number;
      empName: string;
      mobile_number: string;
    },
    {
      emp_id: number;
      empName: string;
      mobile_number: string;
    },
    {
      emp_id: number;
      empName: string;
      mobile_number: string;
    }
  ];
}

export interface RaWorkLogPropsData {
  response: {
    code: number;
    msg: string;
  };
  data: [
    {
      created_at: string;
      work_log_text: string;
      log_pic: string;
      address: string;
    }
  ];
}
