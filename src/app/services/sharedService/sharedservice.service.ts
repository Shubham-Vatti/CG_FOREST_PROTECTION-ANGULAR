import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedserviceService {
  constructor() {}

  private refreshFlag = false;

  private selectedCrimeDate = '';
  
  addedPlantJson:string = "";
  setAddPlantJson(addedPlantJson:string){
    this.addedPlantJson = addedPlantJson;
  }
  
  getAddedPlanJson():string{
    return this.addedPlantJson;
  }


  setSelectedCrimDate(selectedDate: string) {
    this.selectedCrimeDate = selectedDate;
  }
  getSelectedCrimeDate(): string {
    return this.selectedCrimeDate;
  }

  setRefresh(value: boolean) {
    this.refreshFlag = value;
  }

  getRefresh(): boolean {
    return this.refreshFlag;
  }


}
