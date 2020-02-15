import { TestBed } from '@angular/core/testing';

import { ParserService } from '../service/parser.service';

describe('ParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParserService = TestBed.get(ParserService);
    expect(service).toBeTruthy();
  });
});
