import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginFormService {
    private roomId: string;
    private username: string;
    private multiplayer: boolean = false;
    private limitedTimeGame: boolean = false;
    private host: boolean = false;
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

    getRoomId() {
        return this.roomId;
    }

    setRoomId(id: string) {
        this.roomId = id;
    }

    setLimitedTimeGame(limitedTimeGame: boolean) {
        this.limitedTimeGame = limitedTimeGame;
    }

    getLimitedTimeGame() {
        return this.limitedTimeGame;
    }
}
