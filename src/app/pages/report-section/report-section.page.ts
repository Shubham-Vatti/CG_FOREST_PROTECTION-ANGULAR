import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonMenuButton,
  IonLabel,
} from '@ionic/angular/standalone';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { masterDataProps } from 'src/app/profile-data/profile_data.model';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { GetMastersResponse } from '../por-form/por-form.model';
import { MasterDataProps } from 'src/assets/models/reusable.model';
import { SQLiteService } from 'src/app/services/localstorage/sqlite.service';
import {
  PORFormDataprops,
  PORFormListProps,
} from '../por-form-list/por-form-list.model';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-report-section',
  templateUrl: './report-section.page.html',
  styleUrls: ['./report-section.page.scss'],
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
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonLabel,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    IonButtons,
    IonMenuButton,
    MatSelect,
  ],
})
export class ReportSectionPage implements OnInit {
  listOfCrimType: any = [];
  selectedCrime: any = null;
  userdata: MasterDataProps = {
    data: [],
    cast: [],
    beat: [],
    crimType: [],
    dhara_data: [
      { id: '', dhara_head: '', dhara_comma_separated: [], dhara_year: '' },
    ],
    prajati_name: [{ id: NaN, name: '' }],
  };
  currentStep = 1; // Track current step (1-4)

  localListToFilterComplainDetail: PORFormDataprops[] = [];
  // Options arrays
  subDivisionOptions: masterDataProps[] = [];
  rangeOptions: masterDataProps[] = [];
  rangeAssistantOptions: masterDataProps[] = [];
  beatGuardOptions: masterDataProps[] = [];

  // Selected values
  selectedSubDivision: masterDataProps | null = null;
  selectedRange: masterDataProps | null = null;
  selectedRangeAssistant: masterDataProps | null = null;
  selectedBeatGuard: masterDataProps | null = null;

  // Form controls
  subDivisionControl = new FormControl<masterDataProps | string>('');
  rangeControl = new FormControl<masterDataProps | string>('');
  rangeAssistantControl = new FormControl<masterDataProps | string>('');
  beatGuardControl = new FormControl<masterDataProps | string>('');

  // Filtered streams
  filteredSubDivisions$!: Observable<masterDataProps[]>;
  filteredRanges$!: Observable<masterDataProps[]>;
  filteredRangeAssistants$!: Observable<masterDataProps[]>;
  filteredBeatGuards$!: Observable<masterDataProps[]>;

  onCrimeChange(selectedCrimeId: number) {
    const selected = this.listOfCrimType.find(
      (item: any) => item.id === selectedCrimeId
    );
    this.selectedCrime = selected.id;
    console.log('--selected-crime-type--', selected.id);
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
    private translate: TranslateService,
    private loader: LoaderService,
    private sqliteService: SQLiteService
  ) {}

  async detailOrAcceptOrReject(
    clickedComplainDetail: PORFormDataprops,
    detailAcceptOrReject: string
  ) {
    let msg = '';

    if (detailAcceptOrReject === '') {
      //console.log("GO TO SEE DETAIL");

      const jsonData = JSON.stringify(clickedComplainDetail);

      this.router.navigateByUrl('/view-complain-detail', {
        state: { data: jsonData },
        replaceUrl: false,
      });

      return;
    }
  }

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

  // Load subdivision data based on user's division_id
  async loadSubDivisions() {
    const divisionId = this.userdata?.data[0]?.division_id;
    if (!divisionId) {
      console.error('No division_id found in user data');
      return;
    }

    await this.loader.show('Loading subdivisions...');

    this.apiService
      .Get_Sub_Division_Data(JSON.stringify({ id: divisionId }))
      .then((subdivisionObservable) => {
        subdivisionObservable.subscribe({
          next: (data) => {
            this.subDivisionOptions = data.data;
            this.filteredSubDivisions$ = this.setupFilterWithObjects(
              this.subDivisionControl,
              this.subDivisionOptions
            );
            this.loader.hide();
          },
          error: (err) => {
            console.error('Sub division API error:', err);
            this.loader.hide();
          },
        });
      });
  }

  async loadRanges(subdivisionId: string) {
    await this.loader.show('Loading ranges...');

    this.apiService
      .Get_Range_Data(JSON.stringify({ id: subdivisionId }))
      .then((rangeObservable) => {
        rangeObservable.subscribe({
          next: (data) => {
            this.rangeOptions = data.data;
            this.filteredRanges$ = this.setupFilterWithObjects(
              this.rangeControl,
              this.rangeOptions
            );
            this.loader.hide();
          },
          error: (err) => {
            console.error('Range API error:', err);
            this.loader.hide();
          },
        });
      });
  }

  // You'll need to implement these API methods in your service
  async loadRangeAssistants(rangeId: string) {
    await this.loader.show('Loading range assistants...');
    this.apiService
      .Get_Sub_Range_Data(JSON.stringify({ id: rangeId }))
      .then((rangeObservable) => {
        rangeObservable.subscribe({
          next: (data) => {
            this.rangeAssistantOptions = data.data;
            this.filteredRangeAssistants$ = this.setupFilterWithObjects(
              this.rangeAssistantControl,
              this.rangeAssistantOptions
            );
            this.loader.hide();
          },
          error: (err) => {
            console.error('Range API error:', err);
            this.loader.hide();
          },
        });
      });
  }

  async loadBeatGuards(rangeAssistantId: string) {
    await this.loader.show('Loading beat guards...');
    this.apiService
      .Get_Beat_Data(JSON.stringify({ id: rangeAssistantId }))
      .then((rangeObservable) => {
        rangeObservable.subscribe({
          next: (data) => {
            this.beatGuardOptions = data.data;
            this.filteredBeatGuards$ = this.setupFilterWithObjects(
              this.beatGuardControl,
              this.beatGuardOptions
            );
            this.loader.hide();
          },
          error: (err) => {
            console.error('Range API error:', err);
            this.loader.hide();
          },
        });
      });
  }

  // Step navigation methods
  onSubDivisionSelected() {
    const selected = this.subDivisionControl.value;
    if (typeof selected === 'object' && selected?.id) {
      this.selectedSubDivision = selected;
      this.loadRanges(selected.id.toString());
      this.currentStep = 2;
      this.rangeControl.reset();
    }
  }

  onRangeSelected() {
    const selected = this.rangeControl.value;
    if (typeof selected === 'object' && selected?.id) {
      this.selectedRange = selected;
      this.loadRangeAssistants(selected.id.toString());
      this.currentStep = 3;
      this.rangeAssistantControl.reset();
    }
  }

  onRangeAssistantSelected() {
    const selected = this.rangeAssistantControl.value;
    if (typeof selected === 'object' && selected?.id) {
      this.selectedRangeAssistant = selected;
      this.loadBeatGuards(selected.id.toString());
      this.currentStep = 4;
      this.beatGuardControl.reset();
    }
  }

  onBeatGuardSelected() {
    const selected = this.beatGuardControl.value;
    if (typeof selected === 'object' && selected?.id) {
      this.selectedBeatGuard = selected;
    }
  }

  // Go back to previous step
  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;

      // Reset subsequent selections
      if (this.currentStep === 1) {
        this.selectedSubDivision = null;
        this.selectedRange = null;
        this.selectedRangeAssistant = null;
        this.selectedBeatGuard = null;
      } else if (this.currentStep === 2) {
        this.selectedRange = null;
        this.selectedRangeAssistant = null;
        this.selectedBeatGuard = null;
      } else if (this.currentStep === 3) {
        this.selectedRangeAssistant = null;
        this.selectedBeatGuard = null;
      }
    }
  }

  async submitSelection() {
    // if (
    //   !this.selectedSubDivision ||
    //   !this.selectedRange ||
    //   !this.selectedRangeAssistant ||
    //   !this.selectedBeatGuard
    // ) {
    //   alert('Please complete all selections');
    //   return;
    // }

    const data = {
      circle_id: '',
      crim_type: this.selectedCrime + '',
      designation_id: this.userdata.data[0].designation_id + '',
      emp_id: this.userdata.data[0]?.emp_id + '',
      division_id: this.userdata.data[0]?.division_id + '',
      sub_division_id: this.selectedSubDivision
        ? this.selectedSubDivision.id + ''
        : '',
      rang_id: this.selectedRange ? this.selectedRange.id + '' : '',
      sub_rang_id: this.selectedRangeAssistant
        ? this.selectedRangeAssistant.id + ''
        : '',
      beat_id: this.selectedBeatGuard ? this.selectedBeatGuard.id + '' : '',
    };

    await this.loader.show('Saving selection...');

    (
      await this.apiService.Get_Filter_Complain_List_Data(JSON.stringify(data))
    ).subscribe({
      next: async (response: PORFormListProps) => {
        await this.loader.hide();
        if (response.response.code === 200) {
          this.localListToFilterComplainDetail = response.complainData;
          // this.router.navigate(['menu/dashboard']);
        } else {
          this.localListToFilterComplainDetail = [];
          const errorMsg = response?.response?.msg || 'Unknown error occurred';
          alert(errorMsg);
        }
      },
      error: async (err) => {
        this.localListToFilterComplainDetail = [];
        await this.loader.hide();
        console.error('Submit error:', err);
      },
    });
  }

  async ngOnInit() {
    this.userdata = await this.sqliteService.getOfflineData();
    this.listOfCrimType = this.userdata.crimType;
    this.loadSubDivisions();
  }
}
