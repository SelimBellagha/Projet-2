import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { TopScore } from '@app/interfaces/game.interface';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

@Component({
    selector: 'app-solo-view-page',
    templateUrl: './solo-view-page.component.html',
    styleUrls: ['./solo-view-page.component.scss'],
})
export class SoloViewPageComponent implements OnInit, AfterViewInit {
    @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    gameId: string;
    username: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    nbDifferencesFound: number;
    secondes: number = 0;
    minutes: number = 0;
    intervalID: number;
    newScore: TopScore = {
        position: 'tempPosition',
        gameId: 'tempId',
        gameType: 'solo',
        time: 'tempTime',
        playerName: 'tempName',
    };

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private loginService: LoginFormService,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private socketService: SocketClientService,
    ) {}

    ngOnInit() {
        this.username = this.loginService.getFormData();
        this.startStopWatch();
        this.nbDifferencesFound = 0;
        if (this.displayService.game) {
            this.gameManager.initializeGame(this.displayService.game);
            this.gameName = this.displayService.game.name;
            this.gameId = this.displayService.game.id;
            this.difficulty = this.displayService.convertDifficulty(this.displayService.game);
            this.nbDifferences = this.displayService.game.nbDifferences;
        }
    }

    ngAfterViewInit() {
        this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.putImages();
    }

    stopWatch() {
        this.gameManager.gameTime = 0;
        const timerInterval = 1000;
        const max = 60;
        this.minutes = 0;
        this.secondes = 0;
        this.intervalID = window.setInterval(() => {
            this.gameManager.gameTime++;
            this.secondes = this.gameManager.gameTime % max;
            this.minutes = Math.floor(this.gameManager.gameTime / max);
        }, timerInterval);
    }

    startStopWatch = () => {
        this.stopWatch();
        this.socketService.send('startStopWatch', {});
    };

    stopStopWatch() {
        clearInterval(this.intervalID);
    }

    endGame(): void {
        this.stopStopWatch();
        this.newScore.gameId = this.gameId;
        const doubleDigitsSeconds = 10;
        if (this.secondes < doubleDigitsSeconds) {
            const seconds = '0' + this.secondes;
            this.newScore.time = this.minutes + ':' + seconds;
        } else {
            this.newScore.time = this.minutes + ':' + this.secondes;
        }
        this.newScore.playerName = this.username;
        this.displayService.checkPlayerScore(this.newScore);
        this.gameManager.playWinAudio();
        this.popUpWindow.nativeElement.style.display = 'block';
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
            if (await this.gameManager.onPositionClicked(mousePosition)) {
                // Incrementer le cpt de differences

                this.nbDifferencesFound++;
                if (this.nbDifferences === this.nbDifferencesFound) {
                    this.endGame();
                }
                // Si on a tout trouvé, finir le jeu.
            }
        }
    }
    goToHomePage() {
        this.popUpWindow.nativeElement.style.display = 'none';
        this.router.navigate(['home']);
    }

    goToCongratulations() {
        this.popUpWindow.nativeElement.style.display = 'block';
    }
    returnSelectionPage(): void {
        this.stopStopWatch();
        this.router.navigate(['/gameSelection']);
    }
}
