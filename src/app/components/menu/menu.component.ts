import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  exitOutline,
  home,
  informationCircle,
  newspaper,
  newspaperOutline,
} from 'ionicons/icons';
import { SQLiteService } from 'src/app/services/localstorage/sqlite.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MasterDataProps } from 'src/assets/models/reusable.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [CommonModule, IonicModule, RouterModule, TranslateModule],
})
export class MenuComponent implements OnInit {
  officerName!: string;
  officerPost!: string;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private sqliteservice: SQLiteService,
    private loader: LoaderService // private
  ) {
    addIcons({ home, informationCircle, exitOutline, newspaper });
  }

  userdata!: MasterDataProps;
  public appPages: any[] = [];

  onMenuClick(page: string) {
    this.router.navigate(['menu' + page]);
  }

  async ngOnInit() {
    try {
      this.userdata =
        (await this.sqliteservice.getOfflineData()) as MasterDataProps;
      this.officerName =
        this.userdata.data[0].f_name + ' ' + this.userdata.data[0].l_name;
      this.officerPost = this.userdata.data[0].designation_name;
      this.appPages = [
        {
          title: this.translate.instant('appbar.Title-Dashboard'),
          url: '/dashboard',
          icon: 'home',
        },
        {
          title: this.translate.instant('appbar.Title-POR'),
          url: '/por-form-list',
          icon: 'information-circle',
        },
      ];

      if (this.userdata.data[0].designation_name === 'DFO') {
        this.appPages.push({
          title: this.translate.instant('dashboard.reporttxt'),
          url: '/report-section',
          icon: 'newspaper',
        });
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }

  async onLogout() {
    try {
      this.loader.show('Logging out ...');
      await this.sqliteservice
        .LogoutUser()
        .then(() => {
          this.loader.hide();
          this.router.navigate(['/login'], { replaceUrl: true });
        })
        .catch((err) => {
          this.loader.hide();
        });
    } catch (error) {
      this.loader.hide();
      console.error('Logout failed:', error);
    }
  }
}
