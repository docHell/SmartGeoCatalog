import { TestBed } from '@angular/core/testing';

import { UGBDServiceService } from '../service/ugbdservice.service';

describe('UGBDServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UGBDServiceService = TestBed.get(UGBDServiceService);
    expect(service).toBeTruthy();
  });
});
