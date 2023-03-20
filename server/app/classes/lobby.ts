/* eslint-disable prettier/prettier */
import { Player } from '@app/data/player';

export class Lobby {
    host: Player;
    queue = new Map<string, Player>();
    secondPlayer: Player;
    gameId: string;
    nbDifferencesHost = 0;
    nbDifferencesInvite = 0;

    constructor(host: Player, gameId: string) {
        this.host = host;
        this.gameId = gameId;
    }

    getHost() {
        return this.host;
    }

    addInQueue(name: string, socketId: string) {
        const playerToAdd: Player = {
            playerName: `${name}`,
            socketId: `${socketId}`,
        };
        this.queue.set(playerToAdd.socketId, playerToAdd);
    }

    deleteFromQueue(id: string) {
        this.queue.delete(id);
    }

    clearQueue() {
        this.queue.clear();
    }

    getQueue() {
        return this.queue;
    }

    addPlayer(playerToAdd: Player) {
        this.secondPlayer = playerToAdd;
        this.queue.delete(playerToAdd.socketId);
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
