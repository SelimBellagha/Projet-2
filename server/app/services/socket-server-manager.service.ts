/* eslint-disable @typescript-eslint/naming-convention */
import { Lobby } from '@app/classes/lobby';
import { Player } from '@app/data/player';
import { Message } from '@common/chatMessage';
import * as http from 'http';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { TimerManager } from './timer-manager.service';

const EIGHT = 8;

@Service()
export class SocketServerManager {
    lobbys = new Map<string, Lobby>();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    timerInterval = 1000;
    sio: io.Server;
    constructor(server: http.Server, private timerManager: TimerManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket: Socket) => {
            // message initial
            socket.on('startTimer', () => {
                this.timerManager.startTimer();
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

            socket.on('getRealTime', () => {
                const timerInfo = [this.timerManager.secondes1, this.timerManager.secondes2, this.timerManager.minutes1, this.timerManager.minutes2];
                socket.emit('getRealTime', timerInfo);
            });

            socket.on('createLobby', (data: { gameId: string; playerName: string; roomId: string }) => {
                const host: Player = {
                    playerName: data.playerName,
                    socketId: socket.id,
                };
                const newLobby = new Lobby(host, data.gameId);
                this.lobbys.set(data.roomId, newLobby);
                socket.join(data.roomId);
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

            socket.on('removeFromQueue', (data: { socketId: string; gameId: string }) => {
                const lobby = this.lobbys.get(this.getRoom(data.gameId));
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
                if (this.lobbys.get(data.roomId)) {
                    this.lobbys.delete(data.roomId);
                }
            });

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

            socket.on('giveUp', (data: { roomId: string }) => {
                const lobby = this.lobbys.get(data.roomId);
                if (socket.id === data.roomId && lobby) {
                    this.sio.to(lobby.secondPlayer.socketId).emit('win');
                } else {
                    socket.to(data.roomId).emit('win');
                }
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
            else if (lobby[1].secondPlayer.socketId === socketId) return lobby[1].secondPlayer;
        }
        return;
    }
}
