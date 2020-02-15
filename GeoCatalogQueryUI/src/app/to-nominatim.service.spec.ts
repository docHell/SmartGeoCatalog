import { TestBed } from '@angular/core/testing';

import { ToNominatimService } from '../service/to-nominatim.service';

describe('ToNominatimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToNominatimService = TestBed.get(ToNominatimService);
    expect(service).toBeTruthy();
  });
});
