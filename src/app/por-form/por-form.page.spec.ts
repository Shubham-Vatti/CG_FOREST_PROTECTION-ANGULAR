import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PorFormPage } from './por-form.page';

describe('PorFormPage', () => {
  let component: PorFormPage;
  let fixture: ComponentFixture<PorFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PorFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
