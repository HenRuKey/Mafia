import { TestBed } from '@angular/core/testing';

import { EndGameService } from './end-game.service';

describe('EndGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EndGameService = TestBed.get(EndGameService);
    expect(service).toBeTruthy();
  });
});
