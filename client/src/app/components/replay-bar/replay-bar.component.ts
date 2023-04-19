import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReplayService } from '@app/services/replay.service';

const FOURX_SPEED = 4;
const DEFAULT_SPEED = 1;

@Component({
    selector: 'app-replay-bar',
    templateUrl: './replay-bar.component.html',
    styleUrls: ['./replay-bar.component.scss'],
})
export class ReplayBarComponent implements AfterViewInit {
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    speed: number = 1;
    pause: boolean = false;
    temp: boolean;
    constructor(private replayManager: ReplayService, private router: Router) {}
    ngAfterViewInit(): void {
        this.replayManager.setCurrentSpeed(1);
        this.replayManager.endPopUp = this.popUpWindow;
    }

    onPause(): void {
        this.temp = !this.pause;
        this.pause = this.temp;
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
    onReplay(): void {
        this.popUpWindow.nativeElement.style.display = 'none';
    }
    goToHomePage(): void {
        this.router.navigate(['home']);
    }
}
