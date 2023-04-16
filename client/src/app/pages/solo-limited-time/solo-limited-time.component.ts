import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-solo-limited-time',
    templateUrl: './solo-limited-time.component.html',
    styleUrls: ['./solo-limited-time.component.scss'],
})
export class SoloLimitedTimeComponent implements OnInit, AfterViewInit {
    @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    username: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    nbDifferencesFound: number;
    minutes: number = 0;
    secondes: number = 0;
    intervalID: number;

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private loginService: LoginFormService,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private limitedTimeLobbyService: LimitedTimeLobbyService,
    ) {}

    async ngOnInit() {
        if (!this.limitedTimeLobbyService.firstGame) {
            this.nbDifferencesFound = 0;
            await this.displayService.loadAllGames();
            if (this.displayService.tempGames) {
                this.gameManager.initializeLimitedGame(this.displayService.tempGames);
            }
        } else {
            this.gameManager.initializeGame(this.gameManager.gameData);
            this.nbDifferencesFound = this.limitedTimeLobbyService.differencesFound;
        }
        this.username = this.loginService.getFormData();
        this.gameName = this.gameManager.gameData.name;
        this.difficulty = this.displayService.convertDifficulty(this.gameManager.gameData);
        this.gameManager.putImages();
        // TODO changer time avec temps vue de config
        const time = 30;
        this.timer(time);
    }

    timer(gameTime: number) {
        const timerInterval = 1000;
        const max = 60;
        this.gameManager.gameTime = gameTime;
        this.secondes = this.gameManager.gameTime % max;
        this.minutes = Math.floor(this.gameManager.gameTime / max);
        this.intervalID = window.setInterval(() => {
            this.gameManager.gameTime--;
            this.secondes = this.gameManager.gameTime % max;
            this.minutes = Math.floor(this.gameManager.gameTime / max);
            if (this.minutes <= 0 && this.secondes <= 0) {
                this.secondes = 0;
                this.minutes = 0;
                this.endGame();
            }
        }, timerInterval);
    }

    stopTimer() {
        clearInterval(this.intervalID);
    }

    ngAfterViewInit() {
        this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    endGame(): void {
        this.stopTimer();
        this.gameManager.playWinAudio();
        this.popUpWindow.nativeElement.style.display = 'block';
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
            if (await this.gameManager.onPositionClicked(mousePosition)) {
                // Incremented le cpt de differences
                this.nbDifferencesFound++;
                await this.putNewGame();
                if (this.nbDifferencesFound === this.gameManager.gameNumberMax) {
                    this.endGame();
                }
                // Si on a tout trouvé, finir le jeu.
            }
        }
    }

    async putNewGame() {
        this.gameName = this.gameManager.gameData.name;
        this.difficulty = this.displayService.convertDifficulty(this.gameManager.gameData);
    }

    goToHomePage() {
        this.stopTimer();
        this.popUpWindow.nativeElement.style.display = 'none';
        this.router.navigate(['home']);
    }

    goToCongratulations() {
        this.popUpWindow.nativeElement.style.display = 'block';
    }
}
