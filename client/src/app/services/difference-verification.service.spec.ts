import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Verification } from '@app/interfaces/verification';

import { DifferenceVerificationService } from './difference-verification.service';

describe('DifferenceVerificationService', () => {
    let service: DifferenceVerificationService;
    let httpMock: HttpTestingController;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(DifferenceVerificationService);
        httpMock = TestBed.inject(HttpTestingController);
        // eslint-disable-next-line dot-notation -- baseUrl is private and we need access for the test
        baseUrl = service['baseUrl'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    afterEach(() => {
        httpMock.verify();
    });

    it('should send  a proper Request', () => {
        const expectedResult: Verification = { result: true, index: 0 };
        const idMock = 0;
        const xMock = 0;
        const yMock = 0;
        service.differenceVerification(0, 0, '0');
        const request = httpMock.expectOne(`${baseUrl}/games/difference/${idMock}?ClickX=${xMock}&ClickY=${yMock}`);
        expect(request.request.method).toBe('GET');
        request.flush(expectedResult);
    });
});
