import { TestBed } from '@angular/core/testing';

import { LimitedTimeLobbyService } from './limited-time-lobby.service';

describe('LimitedTimeLobbyService', () => {
    let service: LimitedTimeLobbyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LimitedTimeLobbyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
