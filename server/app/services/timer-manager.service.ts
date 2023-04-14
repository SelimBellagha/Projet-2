import { Service } from 'typedi';
@Service()
export class TimerManager {
    minutes: number = 0;
    secondes: number = 0;
    gameTime: number = 0;

    startTimer(gameTime: number) {
        this.gameTime = gameTime;
        this.timer();
    }

    startStopWatch() {
        this.stopWatch();
    }

    getTimeGame() {
        return this.gameTime;
    }

    timer() {
        const timerInterval = 1000;
        const max = 60;
        this.secondes = this.gameTime % max;
        this.minutes = Math.floor(this.gameTime / max);
        setInterval(() => {
            this.gameTime--;
            this.secondes = this.gameTime % max;
            this.minutes = Math.floor(this.gameTime / max);
        }, timerInterval);
    }

    stopWatch() {
        const timerInterval = 1000;
        const max = 60;
        this.minutes = 0;
        this.secondes = 0;
        setInterval(() => {
            this.gameTime++;
            this.secondes = this.gameTime % max;
            this.minutes = Math.floor(this.gameTime / max);
        }, timerInterval);
    }
}
