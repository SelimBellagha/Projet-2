import { Player } from '@app/data/player';
import { expect } from 'chai';
// import { describe } from 'mocha';
import { Lobby } from './lobby';

describe('LobbyLimitedTime', () => {
    let host: Player;
    let gameId: string;
    let lobby: Lobby;
    const testPlayer: Player = { playerName: 'TestName', socketId: '12345' };

    beforeEach(() => {
        host = { playerName: 'testName', socketId: '123' };
        gameId = '1';
        lobby = new Lobby(host, gameId);
        lobby.addInQueue(testPlayer.playerName, testPlayer.socketId);
    });

    it('getHost should return the host', (done) => {
        expect(lobby.getHost()).to.equal(host);
        done();
    });

    it('addInQueue should add a player to the queue', (done) => {
        expect(lobby.queue.size).to.equal(1);
        const playerInQueue = lobby.queue.get(testPlayer.socketId);
        expect(playerInQueue).to.deep.equal(testPlayer);
        done();
    });

    it('deleteFromQueue should delete a player to the queue', (done) => {
        lobby.deleteFromQueue(testPlayer.socketId);
        expect(lobby.queue.size).to.equal(0);
        expect(lobby.queue.has(testPlayer.socketId)).to.equal(false);
        done();
    });

    it('clearQueue should clear the queue', (done) => {
        lobby.clearQueue();
        expect(lobby.queue.size).to.equal(0);
        done();
    });

    it('getQueue should get the queue', (done) => {
        lobby.getQueue();
        expect(lobby.queue).to.be.a('map');
        expect(lobby.queue.size).to.equal(1);
        expect(lobby.queue.get(testPlayer.socketId)).to.deep.equal(testPlayer);
        done();
    });

    it('addPlayer should add a player as the second player', (done) => {
        lobby.addPlayer(testPlayer);
        expect(lobby.secondPlayer).to.deep.equal(testPlayer);
        expect(lobby.queue.has(testPlayer.socketId)).to.equal(false);
        done();
    });

    it('getSecondPlayer should get the second player', (done) => {
        lobby.addPlayer(testPlayer);
        expect(lobby.getSecondPlayer()).to.equal(testPlayer);
        done();
    });

    it('checkSecondPlayer should return false if no second player has been added', (done) => {
        expect(lobby.checkSecondPlayer()).to.equal(false);
        done();
    });

    it('checkSecondPlayer should return true if a second player has been added', (done) => {
        lobby.addPlayer(testPlayer);
        expect(lobby.checkSecondPlayer()).to.equal(true);
        done();
    });
});
