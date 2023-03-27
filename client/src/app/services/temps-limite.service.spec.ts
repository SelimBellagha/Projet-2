import { TestBed } from '@angular/core/testing';

import { TempsLimiteService } from './temps-limite.service';

describe('TempsLimiteService', () => {
    let service: TempsLimiteService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TempsLimiteService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
