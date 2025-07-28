import { TestBed } from '@angular/core/testing';

import { CaptureImageWithWatermarkService } from './capture-image-with-watermark.service';

describe('CaptureImageWithWatermarkService', () => {
  let service: CaptureImageWithWatermarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptureImageWithWatermarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
