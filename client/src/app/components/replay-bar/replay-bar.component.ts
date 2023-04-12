import { Component } from '@angular/core';
import { ReplayService } from '@app/services/replay.service';

const FOURX_SPEED = 4;
const DEFAULT_SPEED = 1;

@Component({
    selector: 'app-replay-bar',
    templateUrl: './replay-bar.component.html',
    styleUrls: ['./replay-bar.component.scss'],
})
export class ReplayBarComponent {
    speed: number = 1;
    constructor(private replayManager: ReplayService) {}

    onPause(): void {
        this.replayManager.pauseReplay();
    }
    onStart(): void {
        this.replayManager.restartReplay();
    }
    onSetSpeed(): void {
        if (this.speed === FOURX_SPEED) {
            this.speed = DEFAULT_SPEED;
        } else {
            this.speed *= 2;
        }
        this.replayManager.setCurrentSpeed(this.speed);
    }
}
