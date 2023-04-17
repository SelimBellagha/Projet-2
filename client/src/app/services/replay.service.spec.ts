import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplayService } from './replay.service';

describe('ReplayService', () => {
    let service: ReplayService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [RouterTestingModule, HttpClientTestingModule] });
        service = TestBed.inject(ReplayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
