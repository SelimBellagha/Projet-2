/* eslint-disable @typescript-eslint/naming-convention */
import * as http from 'http';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { TimerManager } from './timer-manager.service';

@Service()
export class SocketServerManager {
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
        });
    }
}
