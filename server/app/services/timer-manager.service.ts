import { setInterval } from 'timers';
import { Service } from 'typedi';
@Service()
export class TimerManager {
    minutes: number = 0;
    secondes1: number = 0;
    secondes2: number = 0;
    minutes1: number = 0;
    minutes2: number = 0;

    startTimer() {
        this.timer();
    }

    timer() {
        const decimalMax = 9;
        const centaineMax = 5;
        const timerInterval = 1000;
        setInterval(() => {
            if (this.secondes2 === centaineMax && this.secondes1 === decimalMax) {
                this.secondes2 = 0;
                this.secondes1 = 0;
                this.minutes1++;
            } else if (this.minutes1 === decimalMax) {
                this.minutes1 = 0;
                this.minutes2++;
            }
            if (this.secondes1 === decimalMax) {
                this.secondes2++;
                this.secondes1 = 0;
            } else {
                this.secondes1++;
            }
        }, timerInterval);
    }
}
