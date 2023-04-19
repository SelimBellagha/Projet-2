import { expect } from 'chai';
import { TimerManager } from './timer-manager.service';

describe('TimerManager', () => {
    let timerManager: TimerManager;

    beforeEach(() => {
        timerManager = new TimerManager();
    });

    it('should set the gameTime and start the timer', () => {
        const minute = 60;
        timerManager.startTimer(minute);
        expect(timerManager.getTimeGame()).to.equal(minute);
        // We need to wait for the timer to tick
        setTimeout(() => {
            expect(timerManager.minutes).to.eql(1);
            expect(timerManager.secondes).to.equal(58);
        }, 2000);
    });

    it('should start the stopwatch', () => {
        timerManager.startStopWatch();
        // We need to wait for the stopwatch to tick
        setTimeout(() => {
            expect(timerManager.minutes).to.be.above(0);
            expect(timerManager.secondes).to.be.above(0);
        }, 2000);
    });
});
