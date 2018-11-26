import { TestBed } from '@angular/core/testing';

import { MafiaDbService } from './mafia-db.service';

describe('MafiaDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MafiaDbService = TestBed.get(MafiaDbService);
    expect(service).toBeTruthy();
  });
});
