import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginFormService {
    private username: string;
    private multiplayer: boolean;
    private host: boolean;
    private gameId: string;

    setFormData(name: string) {
        this.username = name;
    }

    getFormData() {
        return this.username;
    }

    setGameType(gameType: boolean) {
        this.multiplayer = gameType;
    }

    getGameType() {
        return this.multiplayer;
    }

    setPlayerType(playerType: boolean) {
        this.host = playerType;
    }

    getPlayerType() {
        return this.host;
    }

    setGameId(id: string) {
        this.gameId = id;
    }

    getGameId() {
        return this.gameId;
    }
}
