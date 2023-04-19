import { Injectable } from '@angular/core';
import { Player } from '@app/interfaces/player';
import { Constants } from '@common/constants';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class LimitedTimeLobbyService {
    firstPlayer: Player;
    secondPlayer: Player;
    roomId: string;
    firstGame: number;
    differencesFound: number;
    timerId: number;
    timeBonus: number;
    initialTime: number;
    penaltyTime: number;

    constructor(private communicationService: CommunicationService) {}

    async getTimeInfo() {
        await this.communicationService.getConstants().subscribe({
            next: (constants: Constants) => {
                this.initialTime = constants.initTime;
                this.penaltyTime = constants.penaltyTime;
                this.timeBonus = constants.timeBonus;
            },
        });
    }
}
