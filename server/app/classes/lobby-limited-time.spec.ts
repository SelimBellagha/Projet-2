import { Player } from '@app/data/player';
import { expect } from 'chai';
import { LobbyLimitedTime } from './lobby-limited-time';

describe('LobbyLimitedTime', () => {
    let host: Player;
    let limitedLobby: LobbyLimitedTime;
    const testPlayer: Player = { playerName: 'TestName', socketId: '12345' };

    beforeEach(() => {
        host = { playerName: 'testName', socketId: '123' };
        limitedLobby = new LobbyLimitedTime(host);
    });

    it('getHost should return the host', (done) => {
        expect(limitedLobby.getFirstPlayer()).to.equal(host);
        done();
    });

    it('addPlayer should add a player as the second player', (done) => {
        limitedLobby.addPlayer(testPlayer);
        expect(limitedLobby.secondPlayer).to.deep.equal(testPlayer);
        done();
    });

    it('getSecondPlayer should get the second player', (done) => {
        limitedLobby.addPlayer(testPlayer);
        expect(limitedLobby.getSecondPlayer()).to.deep.equal(testPlayer);
        done();
    });

    it('checkSecondPlayer should return false if no second player has been added', (done) => {
        expect(limitedLobby.checkSecondPlayer()).to.equal(false);
        done();
    });

    it('checkSecondPlayer should return true if a second player has been added', (done) => {
        limitedLobby.addPlayer(testPlayer);
        expect(limitedLobby.checkSecondPlayer()).to.equal(true);
        done();
    });
});
