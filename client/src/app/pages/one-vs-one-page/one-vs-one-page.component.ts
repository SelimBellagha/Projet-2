import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
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
    @ViewChild('popUpWindowGiveUp') popUpWindowGiveUp: ElementRef<HTMLDivElement>;
    myUsername: string;
    opponentUsername: string;
    hostName: string;
    guestName: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    minutes: number = 0;
    secondes: number = 0;
    gameTime: number = 0;
    intervalID: number;
    nbDifferencesFoundUser1: number;
    nbDifferencesFoundUser2: number;
    roomId: string;
    nbDifferenceToWin: number;

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private loginService: LoginFormService,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private socketService: SocketClientService,
        private lobbyService: LobbyService,
    ) {}

    ngOnInit() {
        this.roomId = this.lobbyService.roomId;
        if (this.lobbyService.host === false) {
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
                this.gameManager.flashImages(this.gameManager.gameData.differences[data.differenceId]);
            }
            this.winCheck();
        });
        this.socketService.on('win', () => {
            this.winGame();
        });
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

    startStopWatch() {
        this.stopWatch();
    }

    stopStopWatch() {
        clearInterval(this.intervalID);
    }

    loseGame() {
        this.stopStopWatch();
        this.popUpWindowLose.nativeElement.style.display = 'block';
    }

    winGame(): void {
        this.stopStopWatch();
        this.gameManager.playWinAudio();
        this.popUpWindowWin.nativeElement.style.display = 'block';
    }
    goToHomePage() {
        this.popUpWindowWin.nativeElement.style.display = 'none';
        this.popUpWindowLose.nativeElement.style.display = 'none';
        this.router.navigate(['home']);
    }

    giveUp() {
        this.socketService.send('giveUp', { roomId: this.roomId });
        this.socketService.send('systemMessage', ' a abandonné la partie');
        this.goToHomePage();
    }

    goToGiveUp() {
        this.popUpWindowGiveUp.nativeElement.style.display = 'block';
    }

    goToStay() {
        this.popUpWindowGiveUp.nativeElement.style.display = 'none';
    }

    returnSelectionPage(): void {
        this.router.navigate(['/gameSelection']);
    }

    /// ////A adapter selon les joueurs
    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left) {
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
            if (this.nbDifferencesFoundUser1 === this.nbDifferenceToWin && this.lobbyService.host === true) {
                this.winGame();
            } else if (this.nbDifferencesFoundUser2 === this.nbDifferenceToWin && this.lobbyService.host === false) {
                this.winGame();
            } else {
                this.loseGame();
            }
        }
    }
}
