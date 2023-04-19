import { expect } from 'chai';
import { TimerManager } from './timer-manager.service';

describe('TimerManager', () => {
    let timerManager: TimerManager;

    beforeEach(() => {
        timerManager = new TimerManager();
    });

    it('should set the gameTime and start the timer', () => {
        const secondesWait = 1000;
        const minute = 60;
        timerManager.startTimer(minute);
        expect(timerManager.getTimeGame()).to.equal(minute);
        setTimeout(() => {
            expect(timerManager.minutes).to.eql(0);
            expect(timerManager.secondes).to.equal(minute - 2);
        }, secondesWait * 2);
    });

    it('should start the stopwatch', () => {
        timerManager.startStopWatch();
        const secondesWait = 1000;
        setTimeout(() => {
            expect(timerManager.minutes).to.be.above(0);
            expect(timerManager.secondes).to.be.above(0);
        }, secondesWait * 2);
    });
});
