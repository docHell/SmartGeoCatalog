import { TestBed } from '@angular/core/testing';

import { MongoRemoteService } from '../service/mongo-remote.service';

describe('MongoRemoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MongoRemoteService = TestBed.get(MongoRemoteService);
    expect(service).toBeTruthy();
  });
});
