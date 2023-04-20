/* eslint-disable @typescript-eslint/naming-convention */
import { Lobby } from '@app/classes/lobby';
import { LobbyLimitedTime } from '@app/classes/lobby-limited-time';
import { Player } from '@app/data/player';
import { Message } from '@common/chatMessage';
import * as http from 'http';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { GameManager } from './game-manager.service';
import { TimerManager } from './timer-manager.service';

const EIGHT = 8;

@Service()
export class SocketServerManager {
    lobbys = new Map<string, Lobby>();
    limitedLobbys = new Map<string, LobbyLimitedTime>();
    soloTimers = new Map<string, TimerManager>();
    sio: io.Server;
    constructor(server: http.Server, private gameService: GameManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket: Socket) => {
            socket.on('startStopWatch', (data: { roomId: string }) => {
                const lobby = this.lobbys.get(data.roomId);
                if (lobby) {
                    lobby.timer.startStopWatch();
                } else {
                    this.soloTimers.set(socket.id, new TimerManager());
                    this.soloTimers.get(socket.id)?.startStopWatch();
                }
            });

            socket.on('startTimer', (data: { gameTime: number; roomId: string }) => {
                const lobby = this.limitedLobbys.get(data.roomId);
                if (lobby) {
                    lobby.timer.startTimer(data.gameTime);
                } else {
                    this.soloTimers.set(socket.id, new TimerManager());
                    this.soloTimers.get(socket.id)?.startTimer(data.gameTime);
                }
            });

            socket.on('addToTimer', (data: { timeToAdd: number; roomId: string }) => {
                const limitedLobby = this.limitedLobbys.get(data.roomId);
                const soloTimer = this.soloTimers.get(socket.id);
                if (limitedLobby) {
                    limitedLobby.timer.gameTime += data.timeToAdd;
                } else if (soloTimer) {
                    soloTimer.gameTime += data.timeToAdd;
                }
            });

            socket.on('sendChatToServer', (message: Message) => {
                const lobby = this.getLobbyFromSocketID(socket.id);
                let socketOtherPlayer;
                const playerEmitter = this.getPlayerFromSocketId(socket.id);
                if (!playerEmitter) return;
                const now: Date = new Date();
                const timeString: string = now.toTimeString().slice(0, EIGHT);
                const textMessage = '[' + timeString + '] ' + playerEmitter.playerName + ' : ' + message.text;
                message.text = textMessage;
                if (lobby?.host.socketId === socket.id) {
                    socketOtherPlayer = lobby?.secondPlayer.socketId;
                    if (!socketOtherPlayer) return;
                    message.isSender = false;
                    this.sio.to(socketOtherPlayer).emit('receiveChatMessage', message);
                    message.isSender = true;
                    this.sio.to(socket.id).emit('receiveChatMessage', message);
                } else {
                    socketOtherPlayer = lobby?.host.socketId;
                    if (!socketOtherPlayer) return;
                    message.isSender = false;
                    this.sio.to(socketOtherPlayer).emit('receiveChatMessage', message);
                    message.isSender = true;
                    this.sio.to(socket.id).emit('receiveChatMessage', message);
                }
            });

            socket.on('systemMessage', (systemMessage: string) => {
                const lobby = this.getLobbyFromSocketID(socket.id);

                const playerName = this.getPlayerFromSocketId(socket.id)?.playerName;
                if (!lobby) return;
                if (systemMessage === ' a abandonné la partie') {
                    const now: Date = new Date();
                    const timeString: string = now.toTimeString().slice(0, EIGHT);
                    socket.emit('systemMessage', { name: playerName });
                    this.sio.to(lobby?.host.socketId).emit('receiveSystemMessage', playerName + systemMessage);
                    this.sio.to(lobby?.secondPlayer.socketId).emit('receiveSystemMessage', '[' + timeString + '] ' + playerName + systemMessage);
                    return;
                }
                this.sio.to(lobby?.host.socketId).emit('receiveSystemMessage', systemMessage + playerName);
                this.sio.to(lobby?.secondPlayer.socketId).emit('receiveSystemMessage', systemMessage + playerName);
            });

            socket.on('systemMessageSolo', (systemMessage: string) => {
                const now: Date = new Date();
                const timeString: string = now.toTimeString().slice(0, EIGHT);
                this.sio.to(socket.id).emit('receiveSystemMessageSolo', '[' + timeString + '] ' + systemMessage);
            });

            socket.on('getRealTime', (data: { roomId: string }) => {
                const lobby = this.lobbys.get(data.roomId);
                const limitedLobby = this.limitedLobbys.get(data.roomId);
                if (lobby) {
                    socket.emit('getRealTime', { realTime: lobby.timer.getTimeGame() });
                } else if (limitedLobby) {
                    socket.emit('getRealTime', { realTime: limitedLobby.timer.getTimeGame() });
                } else {
                    socket.emit('getRealTime', { realTime: this.soloTimers.get(socket.id)?.getTimeGame() });
                }
            });

            socket.on('createLobby', (data: { gameId: string; playerName: string; roomId: string }) => {
                const host: Player = {
                    playerName: data.playerName,
                    socketId: socket.id,
                };
                const newLobby = new Lobby(host, data.gameId);
                this.lobbys.set(data.roomId, newLobby);
                socket.join(data.roomId);
                this.sio.sockets.emit('updatePlayers', { gameId: data.gameId, available: true });
            });

            socket.on('joinQueue', (data: { gameId: string; playerName: string }) => {
                const roomId = this.getRoom(data.gameId);
                const lobby = this.lobbys.get(roomId);
                if (lobby) {
                    lobby.addInQueue(data.playerName, socket.id);
                    socket.to(lobby.getHost().socketId).emit('updateQueue', { newQueue: JSON.stringify(Array.from(lobby.getQueue().entries())) });
                }
            });

            socket.on('checkPlayersInGame', (data: { gameId: string }) => {
                const roomId = this.getRoom(data.gameId);
                const room = this.sio.sockets.adapter.rooms.get(roomId);
                if (room) {
                    socket.emit('playersInGame', { playersNumber: `${room.size}` });
                } else {
                    socket.emit('playersInGame', { playersNumber: '0' });
                }
            });

            socket.on('removeFromQueue', (data: { socketId: string; roomId: string }) => {
                const lobby = this.lobbys.get(data.roomId);
                if (lobby) {
                    lobby.deleteFromQueue(data.socketId);
                    socket.to(data.socketId).emit('refused');
                    socket.emit('updateQueue', { newQueue: JSON.stringify(Array.from(lobby.getQueue().entries())) });
                }
            });

            socket.on('addToRoom', (data: { opponentId: string; roomId: string }) => {
                const lobby = this.lobbys.get(data.roomId);
                if (lobby) {
                    const playerToAdd = lobby.getQueue().get(data.opponentId);
                    if (playerToAdd) {
                        lobby.addPlayer(playerToAdd);
                        const playerToAddSocket = this.sio.sockets.sockets.get(playerToAdd.socketId);
                        playerToAddSocket?.join(data.roomId);
                        for (const key of lobby.getQueue().keys()) {
                            socket.to(key).emit('refused');
                        }
                        lobby.clearQueue();
                        this.sio.sockets.to(data.roomId).emit('goToGame', { roomId: data.roomId });
                        socket.to(data.roomId).emit('getHostName', { hostName: lobby.getHost().playerName });
                    }
                }
            });

            socket.on('deleteRoom', (data: { roomId: string }) => {
                if (this.lobbys.has(data.roomId)) {
                    const gameId = this.lobbys.get(data.roomId)?.gameId;
                    this.sio.sockets.emit('updatePlayers', { gameId, available: false });
                    this.lobbys.delete(data.roomId);
                } else if (
                    this.limitedLobbys.has(data.roomId) &&
                    (this.limitedLobbys.get(data.roomId)?.checkSecondPlayer() ||
                        this.limitedLobbys.get(data.roomId)?.getFirstPlayer().socketId === socket.id)
                ) {
                    this.limitedLobbys.delete(data.roomId);
                } else {
                    this.soloTimers.delete(socket.id);
                }
            });

            // Fonction non testée car nous n'arrivons pas a initialiser ou get l'id de la socket dans le fichier de test.
            socket.on('differenceFound', (data: { roomId: string; differenceId: number }) => {
                const lobby = this.lobbys.get(data.roomId);
                if (lobby) {
                    if (lobby.getHost().socketId === socket.id) {
                        lobby.nbDifferencesHost++;
                    } else {
                        lobby.nbDifferencesInvite++;
                    }
                    this.sio.sockets.to(data.roomId).emit('differenceUpdate', {
                        nbDifferenceHost: lobby?.nbDifferencesHost,
                        nbDifferenceInvite: lobby?.nbDifferencesInvite,
                        differenceId: data.differenceId,
                    });
                }
            });
            // Fonction non testée car nous n'arrivons pas a initialiser ou get l'id de la socket dans le fichier de test.
            socket.on('giveUp', (data: { roomId: string }) => {
                const lobby = this.lobbys.get(data.roomId);
                if (socket.id === data.roomId && lobby) {
                    this.sio.to(lobby.secondPlayer.socketId).emit('win');
                } else {
                    socket.to(data.roomId).emit('win');
                }
            });
            // Fonction non testée car nous n'arrivons pas a mock le retour de 'this.gameService.getAllGames()'
            socket.on('checkLimitedGame', async (data: { playerName: string; roomId: string }) => {
                const lobby = this.checkLimitedLobby();
                const max = (await this.gameService.getAllGames()).length;
                const min = 0;
                const firstGameNumber = Math.floor(Math.random() * (max - min + 1) + min);
                if (lobby) {
                    const playerToAdd: Player = {
                        playerName: data.playerName,
                        socketId: socket.id,
                    };
                    lobby[1].addPlayer(playerToAdd);
                    socket.join(lobby[0]);
                    this.sio.sockets.to(lobby[0]).emit('goToCoopGame', { roomId: lobby[0], firstGame: firstGameNumber });
                    this.sio.sockets
                        .to(lobby[0])
                        .emit('getPlayers', { firstPlayer: lobby[1].getFirstPlayer(), secondPlayer: lobby[1].getSecondPlayer() });
                } else {
                    const player: Player = {
                        playerName: data.playerName,
                        socketId: socket.id,
                    };
                    const newLimitedLobby = new LobbyLimitedTime(player);
                    this.limitedLobbys.set(data.roomId, newLimitedLobby);
                    socket.join(data.roomId);
                }
            });

            socket.on('gamesNumber', (data: { gamesNumber: number; roomId: string }) => {
                const lobby = this.limitedLobbys.get(data.roomId);
                if (lobby) {
                    lobby.gamesNumber = data.gamesNumber;
                }
            });

            socket.on('limitedDifferenceFound', (data: { roomId: string }) => {
                const lobby = this.limitedLobbys.get(data.roomId);
                const min = 0;
                if (lobby) {
                    lobby.differencesFound++;
                    lobby.gamesNumber--;
                    const max = lobby.gamesNumber;
                    const newGameNumber = Math.floor(Math.random() * (max - min + 1) + min);
                    this.sio.sockets
                        .to(data.roomId)
                        .emit('LimitedDifferenceUpdate', { nbDifferences: lobby.differencesFound, newGame: newGameNumber });
                }
            });

            socket.on('limitedTimeGiveUp', (data: { roomId: string }) => {
                socket.to(data.roomId).emit('limitedTimeGiveUp');
            });

            socket.on('joinRoomForTest', (data: { roomId: string }) => {
                socket.join(data.roomId);
            });
        });
    }

    getRoom(gameId: string): string {
        for (const [key, value] of this.lobbys) {
            if (value.gameId === gameId && !value.checkSecondPlayer()) {
                return key;
            }
        }
        return '';
    }

    getLobbyFromSocketID(socketId: string) {
        for (const lobby of this.lobbys) {
            if (lobby[1].host.socketId === socketId) return lobby[1];
            else if (lobby[1].secondPlayer.socketId === socketId) return lobby[1];
        }
        return;
    }

    getPlayerFromSocketId(socketId: string) {
        for (const lobby of this.lobbys) {
            if (lobby[1].host.socketId === socketId) return lobby[1].host;
            else if (lobby[1].secondPlayer?.socketId === socketId) return lobby[1].secondPlayer;
        }
        return;
    }

    checkLimitedLobby() {
        for (const limitedLobby of this.limitedLobbys) {
            if (limitedLobby[1].checkSecondPlayer()) {
                continue;
            } else {
                return limitedLobby;
            }
        }
        return;
    }
}
