import { Injectable } from '@angular/core';
import { Player } from '@app/interfaces/player';

@Injectable({
    providedIn: 'root',
})
export class LimitedTimeLobbyService {
    firstPlayer: Player;
    secondPlayer: Player;
    roomId: string;
    firstGame: number;
    differencesFound: number;
}
