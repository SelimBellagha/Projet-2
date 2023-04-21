import { Injectable } from '@angular/core';
import { Player } from '@app/interfaces/player';
import { firstValueFrom } from 'rxjs';
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
        const constants = await firstValueFrom(this.communicationService.getConstants());
        this.initialTime = constants.initTime;
        this.penaltyTime = constants.penaltyTime;
        this.timeBonus = constants.timeBonus;
    }
}
