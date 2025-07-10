import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith, of } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Ionic Modules
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCol,
  IonRow,
  IonGrid,
  IonImg,
  IonButton,
} from '@ionic/angular/standalone';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { masterDataProps } from './profile_data.model';
import { GetMastersResponse } from '../pages/por-form/por-form.model';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.page.html',
  styleUrls: ['./profile-data.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    TranslateModule,
    // Ionic
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonButton,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class ProfileDataPage implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: ApiService,
    private translate: TranslateService,
    private loader: LoaderService
  ) {}

  private setupFilterWithObjects(
    control: FormControl,
    options: masterDataProps[]
  ): Observable<masterDataProps[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map((value: string | masterDataProps) => {
        const filterValue =
          typeof value === 'string'
            ? value.toLowerCase()
            : value.name.toLowerCase();
        return options.filter((option) =>
          option.name.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  displayFn(item: masterDataProps): string {
    return item && item.name ? item.name : '';
  }

  async load_circle_Data() {
    this.apiService.Get_Circle_Data().then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          console.log('--data--', data);
          this.circleOptions = data.data;
          this.filteredCircles$ = this.setupFilterWithObjects(
            this.circleControl,
            this.circleOptions // Use the correct property for display
          );
        },
        error: (err) => {
          console.error('Circle API error:', err);
        },
      });
    });
  }

  async Submit_Data(body: string) {
    this.apiService.submitProfilData(body).subscribe({
      next: async (response: GetMastersResponse) => {
        console.log('--response--', response);
        await this.loader.hide();
        if (response.response.code === 200) {
          this.router.navigate(['menu/dashboard']);
        } else {
          await this.loader.hide();
          alert(response.response.msg);
        }
      },
    });
  }

  async load_division_Data(data: string) {
    await this.apiService.Get_Division_Data(data).then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          console.log('--data--', data);
          this.divisionOptions = data.data;
          this.filteredDivisions$ = this.setupFilterWithObjects(
            this.divisionControl,
            this.divisionOptions // Use the correct property for display
          );
        },
        error: (err) => {
          console.error('Division API error:', err);
        },
      });
    });
  }

  async load_sub_division_Data(data: string) {
    this.apiService.Get_Sub_Division_Data(data).then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          console.log('--data--', data);
          this.subDivisionOptions = data.data;
          this.filteredSubDivisions$ = this.setupFilterWithObjects(
            this.subDivisionControl,
            this.subDivisionOptions // Use the correct property for display
          );
        },
        error: (err) => {
          console.error('Sub division API error:', err);
        },
      });
    });
  }

  async load_range_Data(data: string) {
    this.apiService.Get_Range_Data(data).then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          console.log('--data--', data);
          this.rangeOptions = data.data;
          this.filteredRanges$ = this.setupFilterWithObjects(
            this.rangeControl,
            this.rangeOptions // Use the correct property for display
          );
        },
        error: (err) => {
          console.error('range API error:', err);
        },
      });
    });
  }

  async load_beat_Data(data: string) {
    this.apiService.Get_Beat_Data(data).then((circleObservable) => {
      circleObservable.subscribe({
        next: (data) => {
          console.log('--data--', data);
          this.beatOptions = data.data;
          this.filteredBeats$ = this.setupFilterWithObjects(
            this.beatControl,
            this.beatOptions // Use the correct property for display
          );
        },
        error: (err) => {
          console.error('beat API error:', err);
        },
      });
    });
  }

  // Example values for all dropdowns
  userdata: any = null;
  autoCompleteFields: {
    label: string;
    controlName: string;
    control: FormControl;
    options$: () => Observable<masterDataProps[]>;
    autocompleteRef: string;
  }[] = [];
  circleOptions: masterDataProps[] = [];
  divisionOptions: masterDataProps[] = [];
  subDivisionOptions: masterDataProps[] = [];
  rangeOptions: masterDataProps[] = [];
  beatOptions: masterDataProps[] = [];

  //id
  circleId = 0;
  divisionId = 0;
  subdivisionId = 0;
  rangeId = 0;
  beatId = 0;

  // Form controls
  circleControl = new FormControl<masterDataProps | string>('' as any);
  divisionControl = new FormControl<masterDataProps | string>({
    value: '',
    disabled: true,
  });
  subDivisionControl = new FormControl<masterDataProps | string>({
    value: '',
    disabled: true,
  });
  rangeControl = new FormControl<masterDataProps | string>({
    value: '',
    disabled: true,
  });
  beatControl = new FormControl<masterDataProps | string>({
    value: '',
    disabled: true,
  });

  // Filtered streams
  filteredCircles$!: Observable<masterDataProps[]>;
  filteredDivisions$!: Observable<masterDataProps[]>;
  filteredSubDivisions$!: Observable<masterDataProps[]>;
  filteredRanges$!: Observable<masterDataProps[]>;
  filteredBeats$!: Observable<masterDataProps[]>;

  ngOnInit() {
    const strdata = localStorage.getItem('user');
    this.userdata = strdata ? JSON.parse(strdata) : null;
    this.load_circle_Data();

    if (this.userdata?.designation_name === 'BG') {
      this.autoCompleteFields = [
        {
          label: this.translate.instant('profile-setup.s-circle'),
          controlName: 'circleControl',
          control: this.circleControl,
          options$: () => this.filteredCircles$,
          autocompleteRef: 'autoCircle',
        },
        {
          label: this.translate.instant('profile-setup.s-division'),
          controlName: 'divisionControl',
          control: this.divisionControl,
          options$: () => this.filteredDivisions$,
          autocompleteRef: 'autoDivision',
        },
        {
          label: this.translate.instant('profile-setup.s-subdivision'),
          controlName: 'subDivisionControl',
          control: this.subDivisionControl,
          options$: () => this.filteredSubDivisions$,
          autocompleteRef: 'autoSubDivision',
        },
        {
          label: this.translate.instant('profile-setup.s-range'),
          controlName: 'rangeControl',
          control: this.rangeControl,
          options$: () => this.filteredRanges$,
          autocompleteRef: 'autoRange',
        },
        {
          label: this.translate.instant('profile-setup.s-beat'),
          controlName: 'beatControl',
          control: this.beatControl,
          options$: () => this.filteredBeats$,
          autocompleteRef: 'autoBeat',
        },
      ];
    } else if (this.userdata?.designation_name === 'RO') {
      this.autoCompleteFields = [
        {
          label: this.translate.instant('profile-setup.s-circle'),
          controlName: 'circleControl',
          control: this.circleControl,
          options$: () => this.filteredCircles$,
          autocompleteRef: 'autoCircle',
        },
        {
          label: this.translate.instant('profile-setup.s-division'),
          controlName: 'divisionControl',
          control: this.divisionControl,
          options$: () => this.filteredDivisions$,
          autocompleteRef: 'autoDivision',
        },
        {
          label: this.translate.instant('profile-setup.s-subdivision'),
          controlName: 'subDivisionControl',
          control: this.subDivisionControl,
          options$: () => this.filteredSubDivisions$,
          autocompleteRef: 'autoSubDivision',
        },
        {
          label: this.translate.instant('profile-setup.s-range'),
          controlName: 'rangeControl',
          control: this.rangeControl,
          options$: () => this.filteredRanges$,
          autocompleteRef: 'autoRange',
        },
      ];
    } else if (this.userdata?.designation_name == 'SDO') {
      this.autoCompleteFields = [
        {
          label: this.translate.instant('profile-setup.s-circle'),
          controlName: 'circleControl',
          control: this.circleControl,
          options$: () => this.filteredCircles$,
          autocompleteRef: 'autoCircle',
        },
        {
          label: this.translate.instant('profile-setup.s-division'),
          controlName: 'divisionControl',
          control: this.divisionControl,
          options$: () => this.filteredDivisions$,
          autocompleteRef: 'autoDivision',
        },
        {
          label: this.translate.instant('profile-setup.s-subdivision'),
          controlName: 'subDivisionControl',
          control: this.subDivisionControl,
          options$: () => this.filteredSubDivisions$,
          autocompleteRef: 'autoSubDivision',
        },
      ];
    } else if (this.userdata.designation_name == 'DFO') {
      this.autoCompleteFields = [
        {
          label: this.translate.instant('profile-setup.s-circle'),
          controlName: 'circleControl',
          control: this.circleControl,
          options$: () => this.filteredCircles$,
          autocompleteRef: 'autoCircle',
        },
        {
          label: this.translate.instant('profile-setup.s-division'),
          controlName: 'divisionControl',
          control: this.divisionControl,
          options$: () => this.filteredDivisions$,
          autocompleteRef: 'autoDivision',
        },
      ];
    } else if (this.userdata.designation_name == 'CFO') {
      this.autoCompleteFields = [
        {
          label: this.translate.instant('profile-setup.s-circle'),
          controlName: 'circleControl',
          control: this.circleControl,
          options$: () => this.filteredCircles$,
          autocompleteRef: 'autoCircle',
        },
      ];
    } else {
      // default or other designation handling
      this.autoCompleteFields = [];
    }

    this.circleControl.valueChanges.subscribe((selectedCircle) => {
      if (
        typeof selectedCircle === 'object' &&
        selectedCircle !== null &&
        'id' in selectedCircle
      ) {
        this.circleId = selectedCircle.id;
        this.load_division_Data(
          JSON.stringify({
            id: selectedCircle.id + '',
          })
        );
        // console.log('--circile--selected--data--',this.circleControl.value)
        // console.log('--circle--',selectedCircle)
        {(this.userdata.designation_name!="CFO")&&this.divisionControl.enable();}
      } else {
        this.divisionControl.reset();
        this.divisionControl.disable();
        this.subDivisionControl.reset();
        this.subDivisionControl.disable();
        this.rangeControl.reset();
        this.rangeControl.disable();
        this.beatControl.reset();
        this.beatControl.disable();
      }
    });

    this.divisionControl.valueChanges.subscribe((selectedDivision) => {
      if (
        typeof selectedDivision === 'object' &&
        selectedDivision !== null &&
        'id' in selectedDivision
      ) {
        this.divisionId = selectedDivision.id;
        this.load_sub_division_Data(
          JSON.stringify({
            id: selectedDivision.id + '',
          })
        );
        {(this.userdata.designation_name!='DFO')&&this.subDivisionControl.enable();}
      } else {
        this.subDivisionControl.reset();
        this.subDivisionControl.disable();
        this.rangeControl.reset();
        this.rangeControl.disable();
        this.beatControl.reset();
        this.beatControl.disable();
      }
    });

    this.subDivisionControl.valueChanges.subscribe((selectedSubDivision) => {
      if (
        typeof selectedSubDivision === 'object' &&
        selectedSubDivision !== null &&
        'id' in selectedSubDivision
      ) {
        this.subdivisionId = selectedSubDivision.id;
        this.load_range_Data(
          JSON.stringify({
            id: selectedSubDivision.id + '',
          })
        );
        {(this.userdata.designation_name!="SDO")&&this.rangeControl.enable();}
      } else {
        this.rangeControl.reset();
        this.rangeControl.disable();
        this.beatControl.reset();
        this.beatControl.disable();
      }
    });

    this.rangeControl.valueChanges.subscribe((selectedRange) => {
      if (
        typeof selectedRange === 'object' &&
        selectedRange !== null &&
        'id' in selectedRange
      ) {
        this.rangeId = selectedRange.id;
        this.load_beat_Data(
          JSON.stringify({
            id: selectedRange.id + '',
          })
        );
        {(this.userdata.designation_name!="RO")&&this.beatControl.enable();}
      } else {
        this.beatControl.reset();
        this.beatControl.disable();
      }
    });

    this.beatControl.valueChanges.subscribe((selectedRange) => {
      if (
        typeof selectedRange === 'object' &&
        selectedRange !== null &&
        'id' in selectedRange
      ) {
        this.beatId = selectedRange.id;
      }
    });
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  async onClick() {
  if (typeof this.circleControl.value !== 'object' || !this.circleControl.value?.id) {
    alert('Please select a valid Circle from dropdown');
    return;
  }
  if ((this.divisionControl.enabled) &&(typeof this.divisionControl.value !== 'object' || !this.divisionControl.value?.id)) {
    
    alert('Please select a valid Division from dropdown');
    return;
  }
  if ((this.subDivisionControl.enabled) &&(typeof this.subDivisionControl.value !== 'object' || !this.subDivisionControl.value?.id)) {
    alert('Please select a valid Sub Division from dropdown');
    return;
  }
  if ((this.rangeControl.enabled) &&(typeof this.rangeControl.value !== 'object' || !this.rangeControl.value?.id)) {
    alert('Please select a valid Range from dropdown');
    return;
  }
  if ((this.beatControl.enabled) &&(typeof this.beatControl.value !== 'object' || !this.beatControl.value?.id)) {
    alert('Please select a valid Beat from dropdown');
    return;
  }
    let data = {
      empId: this.userdata.emp_id + '',
      circleId: this.circleId + '',
      divisionId: this.divisionId + '',
      subDivisionId: this.subdivisionId + '',
      rangId: this.rangeId + '',
      beatId: this.beatId + '',
    };
    await this.loader.show('Updating profile...');
    await this.Submit_Data(JSON.stringify(data))
  }
}
