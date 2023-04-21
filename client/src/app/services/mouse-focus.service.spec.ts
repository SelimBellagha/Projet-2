import { TestBed } from '@angular/core/testing';

import { MouseFocusService } from './mouse-focus.service';

describe('MouseFocusService', () => {
    let service: MouseFocusService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseFocusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
