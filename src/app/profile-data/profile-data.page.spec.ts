import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileDataPage } from './profile-data.page';

describe('ProfileDataPage', () => {
  let component: ProfileDataPage;
  let fixture: ComponentFixture<ProfileDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
