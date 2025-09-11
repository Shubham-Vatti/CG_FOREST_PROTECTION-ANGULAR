import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportSectionPage } from './report-section.page';

describe('ReportSectionPage', () => {
  let component: ReportSectionPage;
  let fixture: ComponentFixture<ReportSectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
