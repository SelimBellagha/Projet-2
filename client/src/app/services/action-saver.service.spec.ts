import { TestBed } from '@angular/core/testing';

import { ActionSaverService } from './action-saver.service';

describe('ActionSaverService', () => {
  let service: ActionSaverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionSaverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
