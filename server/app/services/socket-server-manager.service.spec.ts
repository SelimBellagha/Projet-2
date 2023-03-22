/* eslint-disable object-shorthand */
import { Lobby } from '@app/classes/lobby';
import { Player } from '@app/data/player';
import { Server } from 'app/server';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketServerManager } from './socket-server-manager.service';
import { TimerManager } from './timer-manager.service';
const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let timerManager: TimerManager;
    let service: SocketServerManager;
    let server: Server;
    let clientSocket: Socket;
    const roomId = 'roomId';
    const gameId = 'gameId';
    const host: Player = {
        playerName: 'hostName',
        socketId: 'hostId',
    };
    const lobby = new Lobby(host, gameId);

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        timerManager = service['timerManager'];
        clientSocket = ioClient(urlString);
    });

    afterEach(async () => {
        clientSocket.close();
        service.sio.close();
        sinon.restore();
    });

    it('Receive a startTimer event should call startTimer', (done) => {
        const spy = sinon.spy(timerManager, 'startTimer');
        clientSocket.emit('startTimer');
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a getRealTime event should emit a getRealTime event', (done) => {
        const timeToGet = [1, 1, 1, 1];
        timerManager.secondes1 = 1;
        timerManager.secondes2 = 1;
        timerManager.minutes1 = 1;
        timerManager.minutes2 = 1;
        clientSocket.emit('getRealTime');
        clientSocket.on('getRealTime', (timerInfo: number[]) => {
            expect(timeToGet[0]).to.be.equal(timerInfo[0]);
            expect(timeToGet[1]).to.be.equal(timerInfo[1]);
            expect(timeToGet[2]).to.be.equal(timerInfo[2]);
            expect(timeToGet[3]).to.be.equal(timerInfo[3]);
            done();
        });
    });

    it('Receive a createLobby event should create a lobby and add it in lobbys', (done) => {
        clientSocket.emit('createLobby', { gameId: '1', playerName: 'name', roomId: '2' });
        setTimeout(() => {
            expect(service.lobbys.size).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a createLobby event should create a room and add socket in the room', (done) => {
        clientSocket.emit('createLobby', { gameId: gameId, playerName: 'name', roomId });
        setTimeout(() => {
            expect(service.sio.sockets.adapter.rooms.get(roomId)?.size).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a checkPlayersInGame event should call getRoom', (done) => {
        const spy = sinon.spy(service, 'getRoom');
        clientSocket.emit('checkPlayersInGame', { gameId: '1' });
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY);
    });

    it("Receive a checkPlayersInGame event should return 0 if room don't exist", (done) => {
        clientSocket.emit('checkPlayersInGame', { gameId: '1' });
        clientSocket.on('playersInGame', (data: { playersNumber: string }) => {
            expect(data.playersNumber).to.equal('0');
            done();
        });
    });

    it('Receive a checkPlayersInGame event should return the size of the room if it exist', (done) => {
        clientSocket.emit('createLobby', { gameId: '1', playerName: 'name', roomId: roomId });
        clientSocket.emit('checkPlayersInGame', { gameId: '1' });
        clientSocket.on('playersInGame', (data: { playersNumber: string }) => {
            expect(data.playersNumber).to.equal('1');
            done();
        });
    });

    it('Receive a joinQueue event should call getRoom', (done) => {
        const spy = sinon.spy(service, 'getRoom');
        clientSocket.emit('joinQueue', { gameId: gameId, playerName: 'playerName' });
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a joinQueue event should add player to queue', (done) => {
        const playerName = 'playerName';
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('joinQueue', { gameId: gameId, playerName: playerName });
        setTimeout(() => {
            expect(service.lobbys.get(roomId)?.getQueue().size).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a deleteRoom event should delete in parameter ', (done) => {
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('deleteRoom', { roomId: roomId });
        setTimeout(() => {
            expect(service.lobbys.size).to.equal(0);
            done();
        }, RESPONSE_DELAY);
    });
});
