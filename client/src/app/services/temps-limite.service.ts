import { Injectable } from '@angular/core';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class TempsLimiteService {
    constructor(private timer: TimerService) {}

    startTimer() {
        // TODO changer stopwatch par timer./
        this.timer.stopWatch();
    }
}
