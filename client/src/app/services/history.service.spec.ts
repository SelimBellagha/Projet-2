import { TestBed } from '@angular/core/testing';

import { HistoryService } from '@app/services/history.service';

describe('HistoryService', () => {
    let service: HistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('convertGameLength should convert number of seconds to string of format m:ss', () => {
        const seconds = 90;
        const result = service.convertGameLength(seconds);
        expect(result).toEqual('1:30');
    });
});
