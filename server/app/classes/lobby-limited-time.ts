import { Player } from '@app/data/player';
import { TimerManager } from '@app/services/timer-manager.service';

export class LobbyLimitedTime {
    firstPlayer: Player;
    secondPlayer: Player;
    gamesNumber: number = 0;
    differencesFound: number = 0;
    firstGame: boolean = false;
    timer = new TimerManager();

    constructor(host: Player) {
        this.firstPlayer = host;
    }

    getFirstPlayer() {
        return this.firstPlayer;
    }

    addPlayer(playerToAdd: Player) {
        this.secondPlayer = playerToAdd;
    }

    getSecondPlayer() {
        return this.secondPlayer;
    }

    checkSecondPlayer() {
        if (this.secondPlayer) {
            return true;
        } else {
            return false;
        }
    }
}
