import { Injectable } from '@angular/core';
import { GameHistory } from '@app/interfaces/game-history';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    history: GameHistory;
    constructor() {
        this.history = {
            startDate: 'tempDate',
            gameLength: 'tempLength',
            gameMode: 'Classique',
            namePlayer1: 'tempName1',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: '',
        };
    }

    findGameLength(start: Date) {
        const currentTime = new Date();
        const milliseconds = 1000;
        const totalSeconds = Math.floor((currentTime.getTime() - start.getTime()) / milliseconds);
        return this.convertGameLength(totalSeconds);
    }

    convertGameLength(lengthInSeconds: number): string {
        const minuteToSeconds = 60;
        const minutes = Math.floor(lengthInSeconds / minuteToSeconds);
        const seconds = lengthInSeconds % minuteToSeconds;
        const formattedSeconds = `${seconds}`.padStart(2, '0');
        return `${minutes}:${formattedSeconds}`;
    }
}
