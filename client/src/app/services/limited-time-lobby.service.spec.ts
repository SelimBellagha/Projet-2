import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { LimitedTimeLobbyService } from './limited-time-lobby.service';

describe('LimitedTimeLobbyService', () => {
    let service: LimitedTimeLobbyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(LimitedTimeLobbyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
