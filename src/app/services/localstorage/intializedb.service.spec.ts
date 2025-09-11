import { TestBed } from '@angular/core/testing';

import { IntializedbService } from './intializedb.service';

describe('IntializedbService', () => {
  let service: IntializedbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntializedbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
