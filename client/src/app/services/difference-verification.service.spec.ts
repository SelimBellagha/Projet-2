import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DifferenceVerificationService } from './difference-verification.service';

describe('DifferenceVerificationService', () => {
    let service: DifferenceVerificationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(DifferenceVerificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
