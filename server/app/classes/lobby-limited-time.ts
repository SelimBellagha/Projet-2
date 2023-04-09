import { Player } from '@app/data/player';

export class LobbyLimitedTime {
    firstPlayer: Player;
    secondPlayer: Player;
    nbDifferencesHost = 0;
    nbDifferencesInvite = 0;

    constructor(host: Player) {
        this.firstPlayer = host;
    }

    getHost() {
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
