import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GiveUpComponent } from '@app/components/give-up/give-up.component';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { VictoryComponent } from '@app/components/victory/victory.component';
import { TopScore } from '@app/interfaces/game.interface';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { HistoryService } from '@app/services/history.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

@Component({
    selector: 'app-one-vs-one-page',
    templateUrl: './one-vs-one-page.component.html',
    styleUrls: ['./one-vs-one-page.component.scss'],
})
export class OneVsOnePageComponent implements OnInit, AfterViewInit {
    @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('popUpWindowWin') popUpWindowWin: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindowLose') popUpWindowLose: ElementRef<HTMLDivElement>;
    myUsername: string;
    opponentUsername: string;
    hostName: string;
    guestName: string;
    gameId: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    minutes: number = 0;
    secondes: number = 0;
    intervalID: number;
    nbDifferencesFoundUser1: number;
    nbDifferencesFoundUser2: number;
    roomId: string;
    nbDifferenceToWin: number;
    gameTime: number;

    newScore: TopScore = {
        position: 'tempPosition',
        gameId: 'tempId',
        gameType: '1v1',
        time: 'tempTime',
        playerName: 'tempName',
    };
    startDate: Date;
    addedToHistory: boolean = false;
    inReplay: boolean = false;

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private dialogRef: MatDialog,
        private loginService: LoginFormService,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private socketService: SocketClientService,
        private lobbyService: LobbyService,
        private historyService: HistoryService,
    ) {
        this.startDate = new Date();
    }

    ngOnInit() {
        this.addedToHistory = false;
        this.historyService.history = {
            startDate: this.startDate.toLocaleString(),
            gameLength: 'tempLength',
            gameMode: 'Classique',
            namePlayer1: 'tempName1',
            namePlayer2: '',
            winnerName: '',
            nameAbandon: '',
        };
        this.roomId = this.lobbyService.roomId;
        if (!this.lobbyService.host) {
            this.socketService.on('getHostName', (data: { hostName: string }) => {
                this.opponentUsername = data.hostName;
                this.hostName = data.hostName;
                this.myUsername = this.loginService.getFormData();
                this.guestName = this.loginService.getFormData();
            });
        } else {
            this.myUsername = this.loginService.getFormData();
            this.hostName = this.loginService.getFormData();
            this.opponentUsername = this.lobbyService.opponent.playerName;
            this.guestName = this.lobbyService.opponent.playerName;
        }
        this.startStopWatch();
        this.nbDifferencesFoundUser1 = 0;
        this.nbDifferencesFoundUser2 = 0;
        if (this.displayService.game) {
            this.gameManager.initializeGame(this.displayService.game);
            this.gameId = this.displayService.game.id;
            this.gameName = this.displayService.game.name;
            this.difficulty = this.displayService.convertDifficulty(this.displayService.game);
            this.nbDifferences = this.displayService.game.nbDifferences;
            this.nbDifferenceToWin = Math.ceil(this.nbDifferences / 2);
        }
    }

    async ngAfterViewInit() {
        this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.putImages();
        this.socketService.on('differenceUpdate', async (data: { nbDifferenceHost: number; nbDifferenceInvite: number; differenceId: number }) => {
            this.nbDifferencesFoundUser1 = data.nbDifferenceHost;
            this.nbDifferencesFoundUser2 = data.nbDifferenceInvite;
            if (this.gameManager.lastDifferenceFound !== data.differenceId) {
                this.gameManager.lastDifferenceFound = data.differenceId;
                this.gameManager.opponentFoundDifference(data.differenceId);
            }
            this.winCheck();
        });
        this.socketService.on('win', () => {
            this.winGameAfterGiveUp();
        });
        this.socketService.on('systemMessage', (data: { name: string }) => {
            this.historyService.history.namePlayer1 = this.hostName;
            this.historyService.history.namePlayer2 = this.guestName;
            this.historyService.history.nameAbandon = data.name;
            if (data.name === this.hostName) {
                this.historyService.history.winnerName = this.guestName;
            } else {
                this.historyService.history.winnerName = this.hostName;
            }
            this.historyService.history.gameLength = this.historyService.findGameLength(this.startDate);
            this.displayService.addHistory(this.historyService.history);
        });
    }

    formatTime(minutes: number, seconds: number): string {
        const secondsInMinute = 60;
        const totalSeconds = minutes * secondsInMinute + seconds;
        const formattedMinutes = Math.floor(totalSeconds / secondsInMinute);
        const formattedSeconds = totalSeconds % secondsInMinute;
        const formattedTime = `${formattedMinutes}:${formattedSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
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

    startStopWatch() {
        this.stopWatch();
        if (this.lobbyService.host) {
            this.socketService.send('startStopWatch', { roomId: this.lobbyService.roomId });
        }
    }

    stopStopWatch() {
        clearInterval(this.intervalID);
    }

    loseGame() {
        this.stopStopWatch();
        this.popUpWindowLose.nativeElement.style.display = 'block';
    }

    winGameAfterGiveUp(): void {
        this.stopStopWatch();
        this.gameManager.playWinAudio();
        const data = { data1: this.historyService.history, data2: this.newScore, data3: false };
        this.dialogRef.open(VictoryComponent, { data });
        this.inReplay = true;
    }

    winGame(): void {
        this.newScore.time = this.formatTime(this.minutes, this.secondes);
        this.historyService.history.gameLength = this.historyService.findGameLength(this.startDate);
        this.stopStopWatch();
        this.gameManager.playWinAudio();
        const data = { data1: this.historyService.history, data2: this.newScore, data3: true };
        this.dialogRef.open(VictoryComponent, { data });
        this.inReplay = true;
    }

    goToHomePage() {
        this.router.navigate(['home']);
    }

    goToGiveUp() {
        this.dialogRef.open(GiveUpComponent);
        this.socketService.send('giveUp', { roomId: this.roomId });
        this.socketService.send('systemMessage', ' a abandonné la partie');
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left && !this.inReplay) {
            const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
            if (await this.gameManager.onPositionClicked(mousePosition)) {
                // Incrementer le cpt de differences
                this.socketService.send('differenceFound', { roomId: this.roomId, differenceId: this.gameManager.lastDifferenceFound });
                // Si on a tout trouvé, finir le jeu.
            }
        }
    }

    winCheck() {
        if (this.nbDifferencesFoundUser1 === this.nbDifferenceToWin || this.nbDifferencesFoundUser2 === this.nbDifferenceToWin) {
            this.historyService.history.namePlayer1 = this.hostName;
            this.historyService.history.namePlayer2 = this.guestName;
            this.newScore.gameId = this.gameId;
            if (this.nbDifferencesFoundUser1 === this.nbDifferenceToWin && this.lobbyService.host) {
                this.newScore.playerName = this.hostName;
                this.historyService.history.winnerName = this.hostName;
                this.winGame();
            } else if (this.nbDifferencesFoundUser2 === this.nbDifferenceToWin && !this.lobbyService.host) {
                this.newScore.playerName = this.guestName;
                this.historyService.history.winnerName = this.guestName;
                this.winGame();
            } else {
                this.loseGame();
            }
        }
    }
    onReplay(): void {
        this.inReplay = true;
        this.gameManager.enableReplay();
        this.popUpWindowWin.nativeElement.style.display = 'none';
        this.popUpWindowLose.nativeElement.style.display = 'none';
    }
}
