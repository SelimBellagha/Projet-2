import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GiveUpComponent } from '@app/components/give-up/give-up.component';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { TimeOffComponent } from '@app/components/time-off/time-off.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { HistoryService } from '@app/services/history.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

@Component({
    selector: 'app-solo-limited-time',
    templateUrl: './solo-limited-time.component.html',
    styleUrls: ['./solo-limited-time.component.scss'],
})
export class SoloLimitedTimeComponent implements OnInit, AfterViewInit {
    @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    username: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    gameTime: number;
    nbDifferencesFound: number;
    minutes: number = 0;
    secondes: number = 0;
    intervalID: number;
    startDate: Date;

    // eslint-disable-next-line max-params
    constructor(
        private dialogRef: MatDialog,
        private router: Router,
        private loginService: LoginFormService,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private limitedTimeLobbyService: LimitedTimeLobbyService,
        private socketService: SocketClientService,
        private historyService: HistoryService,
    ) {
        this.startDate = new Date();
    }

    async ngOnInit() {
        await this.limitedTimeLobbyService.getTimeInfo();
        this.timer(this.limitedTimeLobbyService.initialTime);
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
        this.socketService.send('startTimer', { gameTime: this.limitedTimeLobbyService.initialTime });
        this.historyService.history = {
            startDate: this.startDate.toLocaleString(),
            gameLength: 'tempLength',
            gameMode: 'Temps Limite',
            namePlayer1: this.username,
            namePlayer2: '',
            winnerName: '',
            nameAbandon: '',
        };
    }

    timer(gameTime: number) {
        const timerInterval = 1000;
        const max = 60;
        this.gameManager.gameTime = gameTime;
        this.gameTime = this.gameManager.gameTime;
        this.secondes = this.gameTime % max;
        this.minutes = Math.floor(this.gameTime / max);
        this.intervalID = window.setInterval(() => {
            this.gameManager.gameTime--;
            this.gameTime = this.gameManager.gameTime;
            this.secondes = this.gameTime % max;
            this.minutes = Math.floor(this.gameTime / max);
            this.socketService.send('getRealTime', {});
            if (this.minutes <= 0 && this.secondes <= 0) {
                this.secondes = 0;
                this.minutes = 0;
                this.timeOff();
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
        this.historyService.history.gameLength = this.historyService.findGameLength(this.startDate);
        this.displayService.addHistory(this.historyService.history);
        this.stopTimer();
        this.gameManager.playWinAudio();
        this.goToCongratulations();
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
            if (await this.gameManager.onPositionClicked(mousePosition)) {
                // Incremented le cpt de differences
                this.nbDifferencesFound++;
                this.socketService.send('addToTimer', { timeToAdd: this.limitedTimeLobbyService.timeBonus });
                this.gameManager.gameTime += this.limitedTimeLobbyService.timeBonus;
                await this.putNewGame();
                if (this.nbDifferencesFound === this.gameManager.gameNumberMax) {
                    this.endGame();
                }
            }
        }
    }

    async putNewGame() {
        this.gameName = this.gameManager.gameData.name;
        this.difficulty = this.displayService.convertDifficulty(this.gameManager.gameData);
    }

    goToGiveup() {
        this.limitedTimeLobbyService.timerId = this.intervalID;
        this.dialogRef.open(GiveUpComponent);
    }

    goToCongratulations() {
        this.dialogRef.open(VictoryComponent);
    }

    timeOff() {
        this.stopTimer();
        this.dialogRef.open(TimeOffComponent);
    }

    goToHomePageAfterQuit() {
        this.stopTimer();
        this.historyService.history.nameAbandon = this.username;
        this.historyService.history.gameLength = this.historyService.findGameLength(this.startDate);
        this.displayService.addHistory(this.historyService.history);
        this.router.navigate(['home']);
    }
}
