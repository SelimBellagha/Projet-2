import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    secondes1 = 0;
    secondes2 = 0;
    minutes1 = 0;
    minutes2 = 0;
    intervalID: number;

    stopWatch() {
        const decimalMax = 9;
        const centaineMax = 5;
        const timerInterval = 1000;
        this.intervalID = window.setInterval(() => {
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
    timer(gameTime: number[]) {
        this.secondes1 = gameTime[0];
        this.secondes2 = gameTime[1];
        this.minutes1 = gameTime[2];
        this.minutes2 = gameTime[3];
        const timerInterval = 1000;
        this.intervalID = window.setInterval(() => {
            if (this.secondes2 === 0 && this.secondes1 === 0) {
                this.secondes2 = 5;
                this.secondes1 = 9;
                this.minutes1--;
            } else if (this.minutes1 === 0) {
                this.minutes1 = 9;
                this.minutes2--;
            }
            if (this.secondes1 === 0) {
                this.secondes2--;
                this.secondes1 = 9;
            } else {
                this.secondes1--;
            }
        }, timerInterval);
    }
}
