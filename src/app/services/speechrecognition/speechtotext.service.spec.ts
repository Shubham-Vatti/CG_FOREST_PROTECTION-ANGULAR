import { TestBed } from '@angular/core/testing';

import { SpeechtotextService } from './speechtotext.service';

describe('SpeechtotextService', () => {
  let service: SpeechtotextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechtotextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
