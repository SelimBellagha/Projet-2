import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { GameManagerService } from '@app/services/game-manager.service';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-solo-view-page',
    templateUrl: './solo-view-page.component.html',
    styleUrls: ['./solo-view-page.component.scss'],
})
export class SoloViewPageComponent implements OnInit, AfterViewInit {
    @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    username: string;
    minutes: number = 0;
    secondes1: number = 0;
    secondes2: number = 0;
    minutes1: number = 0;
    minutes2: number = 0;

    constructor(private loginService: LoginFormService, private gameManager: GameManagerService) {}

    ngOnInit() {
        this.username = this.loginService.getFormData();
        this.startTimer();
    }
    ngAfterViewInit() {
        this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.putImages();
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

    startTimer() {
        this.timer();
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
            if (await this.gameManager.onPositionClicked(mousePosition)) {
                // Incrementer le cpt de differences
                // Si on a tout trouvé, finir le jeu.
            }
        }
    }
}
