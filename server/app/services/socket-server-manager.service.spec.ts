/* eslint-disable object-shorthand */
import { Lobby } from '@app/classes/lobby';
import { Player } from '@app/data/player';
import { Server } from 'app/server';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketServerManager } from './socket-server-manager.service';
const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let service: SocketServerManager;
    let server: Server;
    let clientSocket: Socket;
    const roomId = 'roomId';
    const gameId = 'gameId';
    const host: Player = {
        playerName: 'hostName',
        socketId: 'hostId',
    };
    const secondPlayer: Player = {
        playerName: 'playerName',
        socketId: 'playerId',
    };
    const lobby = new Lobby(host, gameId);

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
    });

    afterEach(async () => {
        clientSocket.close();
        service.sio.close();
        sinon.restore();
    });

    it('Receive a startStopWatch event should call startStopWatch', (done) => {
        service.lobbys.set(roomId, lobby);
        const spy = sinon.spy(lobby.timer, 'startStopWatch');
        lobby.timer.gameTime = 5;
        clientSocket.emit('startStopWatch', { roomId });
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a getRealTime event should emit a getRealTime event', (done) => {
        const testTime = 2;
        const waitingTime = 2100;
        clientSocket.emit('startStopWatch', {});
        clientSocket.on('getRealTime', (data: { realTime: number }) => {
            expect(data.realTime).to.equal(testTime);
            done();
        });
        setTimeout(() => {
            clientSocket.emit('getRealTime', {});
        }, waitingTime);
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

    it('Receive a deleteRoom event should delete room in parameter', (done) => {
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('deleteRoom', { roomId: roomId });
        setTimeout(() => {
            expect(service.lobbys.size).to.equal(0);
            done();
        }, RESPONSE_DELAY);
    });

    it('get room should return the room id if lobby exists', (done) => {
        service.lobbys.set(roomId, lobby);
        expect(service.getRoom(gameId)).to.be.equal(roomId);
        done();
    });

    it("get room should return '' id if lobby don't exists", (done) => {
        expect(service.getRoom(gameId)).to.be.equal('');
        done();
    });

    it('Receive a removeFromQueue event should delete player from queue', (done) => {
        lobby.clearQueue();
        lobby.addInQueue(secondPlayer.playerName, secondPlayer.socketId);
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('removeFromQueue', { socketId: secondPlayer.socketId, roomId: roomId });
        setTimeout(() => {
            expect(service.lobbys.get(roomId)?.getQueue().size).to.equal(0);
            done();
        }, RESPONSE_DELAY);
    });
});
