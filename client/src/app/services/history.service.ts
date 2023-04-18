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
        const totalSeconds = Math.floor((currentTime.getTime() - start.getTime()) / 1000);
        return this.convertGameLength(totalSeconds);
    }

    convertGameLength(lengthInSeconds: number): string {
        const minutes = Math.floor(lengthInSeconds / 60);
        const seconds = lengthInSeconds % 60;
        // const formattedMinutes = `${minutes}`.padStart(2, '0');
        const formattedSeconds = `${seconds}`.padStart(2, '0');
        return `${minutes}:${formattedSeconds}`;
    }
}
