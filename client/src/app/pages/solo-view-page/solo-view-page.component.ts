import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
import { TopScore } from '@app/interfaces/game.interface';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { HistoryService } from '@app/services/history.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { LoginFormService } from '@app/services/login-form.service';

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
    gameTime: number;
    penaltyTime: number;

    inReplay: boolean = false;
    newScore: TopScore = {
        position: 'tempPosition',
        gameId: 'tempId',
        gameType: 'solo',
        time: 'tempTime',
        playerName: 'tempName',
    };
    startDate: Date;
    // Nécéssaire pour que la page ait accès aux services nécéssaires
    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private loginService: LoginFormService,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private limitedTimeLobby: LimitedTimeLobbyService,
        private dialogRef: MatDialog,
        private historyService: HistoryService,
    ) {
        this.startDate = new Date();
    }

    async ngOnInit() {
        this.username = this.loginService.getFormData();
        this.historyService.history = {
            startDate: this.startDate.toLocaleString(),
            gameLength: 'tempLength',
            gameMode: 'Classique',
            namePlayer1: this.username,
            namePlayer2: '',
            winnerName: '',
            nameAbandon: '',
        };
        this.startStopWatch();
        this.nbDifferencesFound = 0;
        if (this.displayService.game) {
            this.gameManager.initializeGame(this.displayService.game);
            this.gameName = this.displayService.game.name;
            this.gameId = this.displayService.game.id;
            this.difficulty = this.displayService.convertDifficulty(this.displayService.game);
            this.nbDifferences = this.displayService.game.nbDifferences;
        }
        await this.limitedTimeLobby.getTimeInfo();
        this.penaltyTime = this.limitedTimeLobby.penaltyTime;
    }

    ngAfterViewInit() {
        this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.putImages();
    }

    stopWatch() {
        this.gameTime = 0;
        this.gameManager.gameTime = 0;
        const timerInterval = 1000;
        const max = 60;
        this.minutes = 0;
        this.secondes = 0;
        this.intervalID = window.setInterval(() => {
            this.gameManager.gameTime++;
            this.gameTime = this.gameManager.gameTime;
            this.secondes = this.gameTime % max;
            this.minutes = Math.floor(this.gameManager.gameTime / max);
        }, timerInterval);
    }

    startStopWatch = () => {
        this.stopWatch();
    };

    stopStopWatch() {
        clearInterval(this.intervalID);
    }

    getGameTime() {
        const doubleDigitsSeconds = 10;
        if (this.secondes < doubleDigitsSeconds) {
            const seconds = '0' + this.secondes;
            return this.minutes + ':' + seconds;
        } else {
            return this.minutes + ':' + this.secondes;
        }
    }

    endGame(): void {
        this.stopStopWatch();
        this.newScore.gameId = this.gameId;
        this.newScore.time = this.getGameTime();
        this.historyService.history.gameLength = this.historyService.findGameLength(this.startDate);
        this.newScore.playerName = this.username;
        this.displayService.checkPlayerScore(this.newScore);
        this.displayService.addHistory(this.historyService.history);
        this.gameManager.playWinAudio();
        this.goToCongratulations();
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left && !this.inReplay) {
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

    goToCongratulations() {
        this.dialogRef.open(VictoryComponent);
        this.onReplay();
    }

    returnSelectionPage(): void {
        this.stopStopWatch();
        this.router.navigate(['/gameSelection']);
    }
    onReplay(): void {
        this.inReplay = true;
        this.gameManager.enableReplay();
    }

    abandonGame(): void {
        this.stopStopWatch();
        this.historyService.history.gameLength = this.historyService.findGameLength(this.startDate);
        this.historyService.history.nameAbandon = this.historyService.history.namePlayer1;
        this.displayService.addHistory(this.historyService.history);
        this.router.navigate(['/gameSelection']);
    }
}
