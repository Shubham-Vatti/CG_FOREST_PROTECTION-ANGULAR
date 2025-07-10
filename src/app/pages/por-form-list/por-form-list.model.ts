export interface PORFormDataprops {
  complain_id: string;
  transferd_to: string;
  complain_history_table_id: string;
  complain_status: string;
  complain_status_text: string;
  current_stage: string;
  stage_name: string;
  accused_name: string;
  accused_fathers_name: string;
  cast_name: string;
  crime_type: string;
  accused_address: string;
  type_of_crime: string;
  place_of_crime: string;
  date_of_crime: string;
  details_of_seized_goods: string;
  name_of_witness: string;
  show_approve_reject_button: string;
  lat: string;
  lng: string;
  map_address: string;
  imageUrl: string;
}

export interface PORFormListProps {
  response: {
    code: number;
    msg: string;
  };
  complainData: [PORFormDataprops];
  totalComplainData: [
    {
      totalComplain: string;
      whichTypeOfComplain: string;
      whichTypeOfComplainTitle: string;
    },
    {
      totalComplain:string;
      whichTypeOfComplain: string;
      whichTypeOfComplainTitle: string;
    },
    {
      totalComplain: string;
      whichTypeOfComplain: string;
      whichTypeOfComplainTitle: string;
    },
    {
      totalComplain: string;
      whichTypeOfComplain:string;
      whichTypeOfComplainTitle: string;
    }
  ];
}
