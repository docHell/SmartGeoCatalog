import { TestBed } from '@angular/core/testing';

import { ElasticRemoteService } from '../service/elastic-remote.service';

describe('ElasticRemoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElasticRemoteService = TestBed.get(ElasticRemoteService);
    expect(service).toBeTruthy();
  });
});
