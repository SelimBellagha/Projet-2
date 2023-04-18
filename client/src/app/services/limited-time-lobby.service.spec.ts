import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Constants } from '@common/constants';
import { of } from 'rxjs';
import { CommunicationService } from './communication.service';
import { LimitedTimeLobbyService } from './limited-time-lobby.service';
import SpyObj = jasmine.SpyObj;

describe('LimitedTimeLobbyService', () => {
    let service: LimitedTimeLobbyService;
    let communicationSpy: SpyObj<CommunicationService>;

    beforeEach(() => {
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['getConstants']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [{ provide: CommunicationService, useValue: communicationSpy }],
        });
        service = TestBed.inject(LimitedTimeLobbyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get time info', () => {
        const constants: Constants = {
            initTime: 60,
            penaltyTime: 10,
            timeBonus: 5,
        };
        communicationSpy.getConstants.and.returnValue(of(constants));
        service.getTimeInfo();
        expect(service.initialTime).toBe(constants.initTime);
        expect(service.penaltyTime).toBe(constants.penaltyTime);
        expect(service.timeBonus).toBe(constants.timeBonus);
    });
});
