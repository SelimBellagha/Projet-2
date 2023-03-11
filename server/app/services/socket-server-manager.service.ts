/* eslint-disable @typescript-eslint/naming-convention */
import * as http from 'http';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { TimerManager } from './timer-manager.service';

@Service()
export class SocketServerManager {
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

            socket.on('handleGame', (data: { roomName: string }) => {
                const room = this.sio.sockets.adapter.rooms.get(data.roomName);

                if (room) {
                    console.log(room);
                    if (room.size < 2) {
                        socket.join(data.roomName);
                        socket.emit('roomJoined', { roomName: data.roomName });
                    } else {
                        socket.emit('roomFull', { roomName: data.roomName });
                    }
                } else {
                    socket.join(data.roomName);
                    socket.emit('roomCreated', { roomName: data.roomName });
                }
            });

            socket.on('checkPlayersInGame', (data: { roomName: string }) => {
                const room = this.sio.sockets.adapter.rooms.get(data.roomName);
                console.log(data);
                if (room) {
                    console.log(room.size);
                    socket.emit('playersInGame', { playersNumber: String(room.size) });
                } else {
                    console.log('no');
                    socket.emit('playersInGame', { playersNumber: '0' });
                }
            });
        });
    }
}
