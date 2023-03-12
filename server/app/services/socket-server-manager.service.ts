/* eslint-disable @typescript-eslint/naming-convention */
import { Lobby } from '@app/classes/lobby';
import { Player } from '@app/data/player';
import * as http from 'http';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { TimerManager } from './timer-manager.service';

@Service()
export class SocketServerManager {
    lobbys = new Map<string, Lobby>();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    timerInterval = 1000;
    private sio: io.Server;
    constructor(server: http.Server, private timerManager: TimerManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket: Socket) => {
            // message initial
            socket.on('startTimer', () => {
                this.timerManager.startTimer();
            });

            socket.on('getRealTime', () => {
                const timerInfo = [this.timerManager.secondes1, this.timerManager.secondes2, this.timerManager.minutes1, this.timerManager.minutes2];
                socket.emit('getRealTime', timerInfo);
            });

            socket.on('createLobby', (data: { gameId: string; playerName: string }) => {
                const host: Player = {
                    playerName: data.playerName,
                    socketId: socket.id,
                };
                const sId = socket.id;
                const newLobby = new Lobby(host, data.gameId);
                this.lobbys.set(sId, newLobby);
                socket.join(sId);
            });

            socket.on('joinQueue', (data: { gameId: string; playerName: string }) => {
                const roomId = this.getRoom(data.gameId);
                const lobby = this.lobbys.get(roomId);
                if (this.sio.sockets.adapter.rooms.get(roomId) && lobby) {
                    lobby.addInQueue(data.playerName, socket.id);
                    socket.to(lobby.getHost().socketId).emit('updateQueue', { newQueue: JSON.stringify(Array.from(lobby.getQueue().entries())) });
                }
            });

            socket.on('checkPlayersInGame', (data: { gameId: string }) => {
                const roomId = this.getRoom(data.gameId);
                const room = this.sio.sockets.adapter.rooms.get(roomId);
                if (room) {
                    socket.emit('playersInGame', { playersNumber: String(room.size) });
                } else {
                    socket.emit('playersInGame', { playersNumber: '0' });
                }
            });

            socket.on('disconnect', () => {
                this.lobbys.delete(socket.id);
            });

            socket.on('removeFromQueue', (data: { socketId: string; gameId: string }) => {
                const roomId = this.getRoom(data.gameId);
                const lobby = this.lobbys.get(roomId);
                if (lobby) {
                    lobby.deleteFromQueue(data.socketId);
                    socket.to(data.socketId).emit('refused');
                    this.sio.to(lobby.getHost().socketId).emit('updateQueue', { newQueue: JSON.stringify(Array.from(lobby.getQueue().entries())) });
                }
            });

            socket.on('addToRoom', (data: { socketId: string }) => {
                const lobby = this.lobbys.get(socket.id);
                if (lobby) {
                    const playerToAdd = lobby.getQueue().get(data.socketId);
                    if (playerToAdd) {
                        lobby.addPlayer(playerToAdd);
                        const playerToAddSocket = this.sio.sockets.sockets.get(playerToAdd.socketId);
                        playerToAddSocket?.join(socket.id);
                        for (const key of lobby.getQueue().keys()) {
                            socket.to(key).emit('refused');
                        }
                        lobby.clearQueue();
                        this.sio.to(socket.id).emit('goToGame', { socketId: socket.id });
                    }
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
}
