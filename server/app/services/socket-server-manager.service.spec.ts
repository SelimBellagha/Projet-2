/* eslint-disable max-lines */
import { Lobby } from '@app/classes/lobby';
import { LobbyLimitedTime } from '@app/classes/lobby-limited-time';
import { GameData } from '@app/data/game.interface';
import { Player } from '@app/data/player';
import { TopScore } from '@app/data/top-scores.interface';
import { Vec2 } from '@app/data/vec2';
import { Server } from 'app/server';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { GameManager } from './game-manager.service';
import { SocketServerManager } from './socket-server-manager.service';
const RESPONSE_DELAY = 200;
describe('SocketManager service tests', () => {
    let service: SocketServerManager;
    let server: Server;
    let clientSocket: Socket;
    let clientSocket2: Socket;
    const roomId = 'roomId';
    const gameId = 'gameId';
    let gameService: GameManager;
    const host: Player = {
        playerName: 'hostName',
        socketId: 'hostId',
    };
    const secondPlayer: Player = {
        playerName: 'playerName',
        socketId: 'playerId',
    };
    const vec: Vec2 = {
        x: 0,
        y: 0,
    };
    const topScoreTest: TopScore = {
        position: 'testPos',
        gameId: 'testGameId',
        gameType: 'testType',
        time: 'testTime',
        playerName: 'testPlayer',
    };
    const gameData1: GameData = {
        id: 'id',
        name: 'name',
        originalImage: 'image1',
        modifiedImage: 'modifiedImage1',
        differences: [[vec], [vec]],
        nbDifferences: 2,
        isDifficult: true,
    };
    let lobby: Lobby;
    let limitedLobby: LobbyLimitedTime;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        gameService = sinon.createStubInstance(GameManager);
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
        clientSocket2 = ioClient(urlString);
        lobby = new Lobby(host, gameId);
        limitedLobby = new LobbyLimitedTime(host);
    });

    afterEach(async () => {
        service.lobbys.clear();
        service.limitedLobbys.clear();
        service.soloTimers.clear();
        clientSocket.close();
        clientSocket2.close();
        service.sio.close();
        sinon.restore();
    });

    it('Receive a startStopWatch event should call startStopWatch', (done) => {
        service.lobbys.set(roomId, lobby);
        const spy = sinon.spy(lobby.timer, 'startStopWatch');
        clientSocket.emit('startStopWatch', { roomId });
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a startTimer event with roomId should start the Timer', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        const spy = sinon.spy(limitedLobby.timer, 'startTimer');
        const timerTime = 5;
        clientSocket.emit('startTimer', { gameTime: timerTime, roomId });
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a startTimer event without roomId should create a Solo timer', (done) => {
        const timerTime = 5;
        expect(service.soloTimers.size).to.be.equal(0);
        clientSocket.emit('startTimer', { gameTime: timerTime });
        setTimeout(() => {
            expect(service.soloTimers.size).to.be.equal(1);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a addToTimer event with roomId should add to the Timer', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        const gameTime = 5;
        const finalTime = 10;
        clientSocket.emit('startTimer', { gameTime, roomId });
        clientSocket.emit('addToTimer', { timeToAdd: gameTime, roomId });
        setTimeout(() => {
            expect(service.limitedLobbys.get(roomId)?.timer.gameTime).to.be.equal(finalTime);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a addToTimer event without roomId should add to a Solo timer', (done) => {
        const timerTime = 5;
        clientSocket.emit('startTimer', { gameTime: timerTime });
        clientSocket.emit('addToTimer', { timeToAdd: timerTime });
        setTimeout(() => {
            expect(service.soloTimers.size).to.be.equal(1);
            expect(service.soloTimers.values().next().value.gameTime).to.be.equal(timerTime * 2);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a getRealTime event without roomId should emit a soloTimer time', (done) => {
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

    it('Receive a getRealTime event with classic roomId should emit a lobbyTimer time', (done) => {
        const testTime = 2;
        const waitingTime = 2100;
        lobby.timer.gameTime = 0;
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('startStopWatch', { roomId });
        clientSocket.on('getRealTime', (data: { realTime: number }) => {
            expect(data.realTime).to.equal(testTime);
            done();
        });
        setTimeout(() => {
            clientSocket.emit('getRealTime', { roomId });
        }, waitingTime);
    });

    it('Receive a getRealTime event with limited roomId should emit a limitedLobbyTimer time', (done) => {
        const testTime = 2;
        const waitingTime = 500;
        service.limitedLobbys.set(roomId, limitedLobby);
        clientSocket.emit('startTimer', { gameTime: testTime, roomId });
        clientSocket.on('getRealTime', (data: { realTime: number }) => {
            expect(data.realTime).to.equal(testTime);
            done();
        });
        setTimeout(() => {
            clientSocket.emit('getRealTime', { roomId });
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
        clientSocket.emit('createLobby', { gameId, playerName: 'name', roomId });
        setTimeout(() => {
            expect(service.sio.sockets.adapter.rooms.get(roomId)?.size).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a addToRoom event should add player to the lobby', (done) => {
        service.lobbys.set(roomId, lobby);
        lobby.addInQueue(secondPlayer.playerName, secondPlayer.socketId);
        expect(lobby.checkSecondPlayer()).to.be.equal(false);
        clientSocket.emit('addToRoom', { opponentId: secondPlayer.socketId, roomId });
        setTimeout(() => {
            expect(lobby.checkSecondPlayer()).to.be.equal(true);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a addToRoom event should clear the queue', (done) => {
        const tempPlayer: Player = {
            playerName: 'tempPlayer',
            socketId: 'tempId',
        };
        service.lobbys.set(roomId, lobby);
        lobby.addInQueue(secondPlayer.playerName, secondPlayer.socketId);
        lobby.addInQueue(tempPlayer.playerName, tempPlayer.socketId);
        expect(lobby.getQueue().size).to.be.equal(2);
        clientSocket.emit('addToRoom', { opponentId: secondPlayer.socketId, roomId });
        setTimeout(() => {
            expect(lobby.getQueue().size).to.be.equal(0);
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
        clientSocket.emit('createLobby', { gameId: '1', playerName: 'name', roomId });
        clientSocket.emit('checkPlayersInGame', { gameId: '1' });
        clientSocket.on('playersInGame', (data: { playersNumber: string }) => {
            expect(data.playersNumber).to.equal('1');
            done();
        });
    });

    it('Receive a joinQueue event should call getRoom', (done) => {
        const spy = sinon.spy(service, 'getRoom');
        clientSocket.emit('joinQueue', { gameId, playerName: 'playerName' });
        setTimeout(() => {
            expect(spy.called).to.equal(true);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a joinQueue event should add player to queue', (done) => {
        const playerName = 'playerName';
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('joinQueue', { gameId, playerName });
        setTimeout(() => {
            expect(service.lobbys.get(roomId)?.getQueue().size).to.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a systemMessageSolo event should send a receiveSystemMessageSolo event with a message', (done) => {
        const EIGHT = 8;
        const testMessage = 'test Message';
        const now: Date = new Date();
        const timeString: string = now.toTimeString().slice(0, EIGHT);
        clientSocket.on('receiveSystemMessageSolo', (newMessage: string) => {
            expect(newMessage).to.be.equal('[' + timeString + '] ' + testMessage);
            done();
        });
        clientSocket.emit('systemMessageSolo', testMessage);
    });

    it('Receive a globalMessage event should send a receiveSystemMessage to everyone', (done) => {
        const EIGHT = 8;
        const now: Date = new Date();
        const timeString: string = now.toTimeString().slice(0, EIGHT);
        clientSocket2.on('receiveSystemMessage', (newMessage: string) => {
            expect(newMessage).to.be.equal(
                timeString +
                    ` - ${topScoreTest.playerName} obtient la ${topScoreTest.position} place dans 
                les meilleurs temps du jeu ${topScoreTest.gameType}`,
            );
            done();
        });
        clientSocket.emit('globalMessage', topScoreTest);
    });

    it('Receive a deleteRoom event should delete room in parameter', (done) => {
        service.lobbys.set(roomId, lobby);
        clientSocket.emit('deleteRoom', { roomId });
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
        clientSocket.emit('removeFromQueue', { socketId: secondPlayer.socketId, roomId });
        setTimeout(() => {
            expect(service.lobbys.get(roomId)?.getQueue().size).to.equal(0);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a deleteRoom event without roomId should delete a soloTimer', (done) => {
        clientSocket.emit('startStopWatch', {});
        setTimeout(() => {
            expect(service.soloTimers.size).to.be.equal(1);
            clientSocket.emit('deleteRoom', {});
        }, RESPONSE_DELAY);
        setTimeout(() => {
            expect(service.soloTimers.size).to.be.equal(0);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a deleteRoom event with classic roomId should delete a lobbyTimer', (done) => {
        service.lobbys.set(roomId, lobby);
        setTimeout(() => {
            expect(service.lobbys.size).to.be.equal(1);
            clientSocket.emit('deleteRoom', { roomId });
        }, RESPONSE_DELAY);
        setTimeout(() => {
            expect(service.lobbys.size).to.be.equal(0);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a deleteRoom event with limited roomId should delete a limitedLobbyTimer', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        limitedLobby.addPlayer(secondPlayer);
        setTimeout(() => {
            expect(service.limitedLobbys.size).to.be.equal(1);
            clientSocket.emit('deleteRoom', { roomId });
        }, RESPONSE_DELAY);
        setTimeout(() => {
            expect(service.limitedLobbys.size).to.be.equal(0);
            done();
        }, RESPONSE_DELAY * 2);
    });

    xit('Receive a checkLimitedGame event should create a limitedLobby if there is no lobby available', async (done) => {
        expect(service.limitedLobbys.size).to.be.equal(0);
        const fakeGames = [gameData1];
        sinon.stub(gameService, 'getAllGames').resolves(fakeGames);
        clientSocket.emit('checkLimitedGame', { playerName: host.playerName, roomId });
        setTimeout(() => {
            expect(service.limitedLobbys.size).to.be.equal(1);
            expect(service.limitedLobbys.get(roomId)?.firstPlayer.playerName).to.be.equal(host.playerName);
            done();
        }, RESPONSE_DELAY * 2);
    });

    it('Receive a gamesNumber event set lobbys games number with the number of games', (done) => {
        const numberTest = 5;
        service.limitedLobbys.set(roomId, limitedLobby);
        expect(limitedLobby.gamesNumber).to.be.equal(0);
        clientSocket.emit('gamesNumber', { gamesNumber: numberTest, roomId });
        setTimeout(() => {
            expect(limitedLobby.gamesNumber).to.be.equal(numberTest);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a differenceFound event should add the nbDifferences found of the second player if it`s not the host', (done) => {
        service.lobbys.set(roomId, lobby);
        expect(lobby.nbDifferencesInvite).to.be.equal(0);
        clientSocket.emit('differenceFound', { roomId, differenceId: 1 });
        setTimeout(() => {
            expect(lobby.nbDifferencesInvite).to.be.equal(1);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a differenceFound event should send a differenceUpdate event', (done) => {
        const nbDifference = 1;
        lobby.nbDifferencesHost = 1;
        lobby.nbDifferencesInvite = 1;
        const differenceId = 2;
        service.lobbys.set(roomId, lobby);
        clientSocket2.on('differenceUpdate', (data: { nbDifferenceHost: number; nbDifferenceInvite: number; differenceId: number }) => {
            expect(data.nbDifferenceHost).to.be.equal(nbDifference);
            expect(data.nbDifferenceInvite).to.be.equal(nbDifference + 1);
            expect(data.differenceId).to.be.equal(differenceId);
            done();
        });
        clientSocket.emit('joinRoomForTest', { roomId });
        clientSocket2.emit('joinRoomForTest', { roomId });
        clientSocket.emit('differenceFound', { roomId, differenceId });
    });

    it('Receive a limitedDifferenceFound event should send a LimitedDifferenceUpdate event', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        clientSocket.emit('joinRoomForTest', { roomId });
        clientSocket2.emit('joinRoomForTest', { roomId });
        limitedLobby.gamesNumber = 2;
        limitedLobby.differencesFound = 0;
        clientSocket2.on('LimitedDifferenceUpdate', (data: { nbDifferences: number; newGame: number }) => {
            expect(data.nbDifferences).to.be.equal(1);
            expect(data.newGame).to.be.lessThanOrEqual(1);
            expect(data.newGame).to.be.greaterThanOrEqual(0);
            done();
        });
        clientSocket.emit('limitedDifferenceFound', { roomId });
    });

    it('Receive a limitedTimeGiveUp event should send a limitedTimeGiveUp to the room', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        clientSocket.emit('joinRoomForTest', { roomId });
        clientSocket2.emit('joinRoomForTest', { roomId });
        clientSocket2.on('limitedTimeGiveUp', () => {
            done();
        });
        clientSocket.emit('limitedTimeGiveUp', { roomId });
    });

    it('getLobbyFromSocketID should return the lobby where the socket is', (done) => {
        service.lobbys.set(roomId, lobby);
        expect(service.getLobbyFromSocketID(host.socketId)).to.be.equal(lobby);
        done();
    });

    it('getLobbyFromSocketID should return the lobby where the secondPlayer socket is', (done) => {
        service.lobbys.set(roomId, lobby);
        lobby.addPlayer(secondPlayer);
        expect(service.getLobbyFromSocketID(secondPlayer.socketId)).to.be.equal(lobby);
        done();
    });

    it('getLobbyFromSocketID should return the limitedLobby where the secondPlayer socket is', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        limitedLobby.addPlayer(secondPlayer);
        expect(service.getLobbyFromSocketID(secondPlayer.socketId)).to.be.equal(limitedLobby);
        done();
    });

    it('getLobbyFromSocketID should return nothing if there is no lobby', (done) => {
        expect(service.getLobbyFromSocketID(secondPlayer.socketId)).to.be.equal(undefined);
        done();
    });

    it('getPlayerFromSocketId should return the player', (done) => {
        service.lobbys.set(roomId, lobby);
        lobby.addPlayer(secondPlayer);
        expect(service.getPlayerFromSocketId(host.socketId)).to.be.equal(host);
        expect(service.getPlayerFromSocketId(secondPlayer.socketId)).to.be.equal(secondPlayer);
        done();
    });

    it('getPlayerFromSocketId should return the player', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        limitedLobby.addPlayer(secondPlayer);
        expect(service.getPlayerFromSocketId(host.socketId)).to.be.equal(host);
        expect(service.getPlayerFromSocketId(secondPlayer.socketId)).to.be.equal(secondPlayer);
        done();
    });

    it('getPlayerFromSocketId should return nothing if there is no player', (done) => {
        service.lobbys.set(roomId, lobby);
        expect(service.getPlayerFromSocketId(secondPlayer.socketId)).to.be.equal(undefined);
        done();
    });

    it('checkLimitedLobby the lobby were there is no second player', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        const checkLobby = service.checkLimitedLobby();
        if (checkLobby) {
            expect(checkLobby[1]).to.be.equal(limitedLobby);
            done();
        }
    });

    it('checkLimitedLobby should return nothing if there is no limitedLobby available', (done) => {
        service.limitedLobbys.set(roomId, limitedLobby);
        limitedLobby.addPlayer(secondPlayer);
        expect(service.checkLimitedLobby()).to.be.equal(undefined);
        done();
    });

    it('Receive a giveUp event should emit a win event to second player', (done) => {
        service.lobbys.set(roomId, lobby);
        limitedLobby.addPlayer(secondPlayer);
        clientSocket2.on('win', () => {
            done();
        });
        clientSocket.emit('joinRoomForTest', { roomId });
        clientSocket2.emit('joinRoomForTest', { roomId });
        clientSocket.emit('giveUp', { roomId });
    });

    it('Receive a sendChatToServer event should call getLobbyFromSocketID', (done) => {
        const message = 'testMessage';
        service.lobbys.set(roomId, lobby);
        lobby.addPlayer(secondPlayer);
        clientSocket.emit('joinRoomForTest', { roomId });
        clientSocket2.emit('joinRoomForTest', { roomId });
        const spy = sinon.spy(service, 'getLobbyFromSocketID');
        clientSocket.emit('sendChatToServer', { message });
        setTimeout(() => {
            expect(spy.called).to.be.equal(true);
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a systemMessage event should call getLobbyFromSocketID', (done) => {
        const systemMessage = ' a abandonné la partie';
        const anotherMessage = 'testMessage';
        service.lobbys.set(roomId, lobby);
        lobby.addPlayer(secondPlayer);
        sinon.stub(service, 'getLobbyFromSocketID').returns(lobby);
        sinon.stub(service, 'getPlayerFromSocketId').returns(host);
        clientSocket.emit('systemMessage', systemMessage);
        clientSocket.emit('systemMessage', anotherMessage);
        setTimeout(() => {
            done();
        }, RESPONSE_DELAY);
    });

    it('Receive a systemMessage event should emit a systemMessage event', (done) => {
        const systemMessage = ' a abandonné la partie';
        const anotherMessage = 'testMessage';
        service.limitedLobbys.set(roomId, limitedLobby);
        limitedLobby.addPlayer(secondPlayer);
        clientSocket.on('systemMessage', (data: { name: string }) => {
            expect(data.name).to.be.equal(host.playerName);
            done();
        });
        sinon.stub(service, 'getLobbyFromSocketID').returns(limitedLobby);
        sinon.stub(service, 'getPlayerFromSocketId').returns(host);
        clientSocket.emit('systemMessage', systemMessage);
        clientSocket.emit('systemMessage', anotherMessage);
    });
});
