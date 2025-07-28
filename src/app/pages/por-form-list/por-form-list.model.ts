export interface PORFormDataprops {
            complain_id: string,
            transferd_to: string,
            complain_history_table_id:string,
            complain_status: string,
            complain_status_text: string,
            current_stage: string,
            stage_name: string,
            accused_name: string,
            accused_fathers_name: string,
            cast_name: string,
            crime_type:string,
            accused_address:string,
            type_of_crime: string,
            place_of_crime: string,
            date_of_crime: string,
            details_of_seized_goods:string,
            show_approve_reject_button: string,
            lat: string,
            lng: string,
            map_address:string,
            all_image_name: string,
            imageUrl: string,
            name_of_witness_one:string,
            name_of_witness_two: string,
            address_of_witness_one: string,
            address_of_witness_two: string,
            button_text: string,
            complain_progress_stage:string,
            por_number: string,
            compartment_number:string,
            crime_dhara: string,
            left_days_to_resolve_por:string
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
