import { TestBed } from '@angular/core/testing';

import { WebsocketserverService } from './websocketserver.service';

describe('WebsocketserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketserverService = TestBed.get(WebsocketserverService);
    expect(service).toBeTruthy();
  });
});
