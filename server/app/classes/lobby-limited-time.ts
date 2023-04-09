import { Player } from '@app/data/player';

export class LobbyLimitedTime {
    firstPlayer: Player;
    secondPlayer: Player;
    gamesNumber: number = 0;
    differencesFound: number = 0;
    firstGame: boolean = false;

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

    checkFirstPlayer() {
        if (this.firstPlayer) {
            return true;
        } else {
            return false;
        }
    }
}
