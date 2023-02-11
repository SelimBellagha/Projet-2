import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DisplayGameService } from './display-game.service';

describe('DisplayGameService', () => {
    let service: DisplayGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [DisplayGameService],
        });
        service = TestBed.inject(DisplayGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
