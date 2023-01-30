import { TestBed } from '@angular/core/testing';

import { DifferenceDetectionService } from './difference-detection.service';

describe('DifferenceDetectionService', () => {
    let service: DifferenceDetectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DifferenceDetectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
