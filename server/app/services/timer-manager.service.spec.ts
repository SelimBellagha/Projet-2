import { expect } from 'chai';
import { TimerManager } from './timer-manager.service';

describe('TimerManager', () => {
    let timerManager: TimerManager;

    beforeEach(() => {
        timerManager = new TimerManager();
    });

    it('should set the gameTime and start the timer', (done) => {
        const secondesWait = 1050;
        const timeTest = 60;
        timerManager.startTimer(timeTest);
        expect(timerManager.getTimeGame()).to.equal(timeTest);
        setTimeout(() => {
            expect(timerManager.minutes).to.eql(0);
            expect(timerManager.secondes).to.equal(timeTest - 2);
            done();
        }, secondesWait * 2);
    });

    it('should start the stopwatch', (done) => {
        timerManager.startStopWatch();
        const secondesWait = 1050;
        setTimeout(() => {
            expect(timerManager.minutes).to.be.eql(0);
            expect(timerManager.secondes).to.be.eql(2);
            done();
        }, secondesWait * 2);
    });
});
