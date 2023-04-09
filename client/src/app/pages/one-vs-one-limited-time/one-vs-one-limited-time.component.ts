import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { Player } from '@app/interfaces/player';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

@Component({
    selector: 'app-one-vs-one-limited-time',
    templateUrl: './one-vs-one-limited-time.component.html',
    styleUrls: ['./one-vs-one-limited-time.component.scss'],
})
export class OneVsOneLimitedTimeComponent implements OnInit, AfterViewInit {
    @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindowGiveUp') popUpWindowGiveUp: ElementRef<HTMLDivElement>;
    myUsername: string;
    opponentUsername: string;
    firstPlayerName: string;
    secondPlayerName: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    minutes: number = 0;
    secondes: number = 0;
    gameTime: number = 0;
    intervalID: number;
    nbDifferencesFound: number;
    nbDifferenceToWin: number;

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private displayService: DisplayGameService,
        private gameManager: GameManagerService,
        private socketService: SocketClientService,
        private limitedTimeLobbyService: LimitedTimeLobbyService,
    ) {}

    async ngOnInit() {
        // TODO get les nom des joueurs
        this.socketService.on('getPlayers', (data: { firstPlayer: Player; secondPlayer: Player }) => {
            this.limitedTimeLobbyService.firstPlayer = data.firstPlayer;
            this.limitedTimeLobbyService.secondPlayer = data.secondPlayer;
            this.firstPlayerName = this.limitedTimeLobbyService.firstPlayer.playerName;
            this.secondPlayerName = this.limitedTimeLobbyService.secondPlayer.playerName;
        });
        this.startTimer(30);
        this.nbDifferencesFound = 0;
        await this.displayService.loadAllGames();
        if (this.displayService.tempGames) {
            await this.gameManager.initializeLimitedGame(this.displayService.tempGames);
            await this.gameManager.initializeGame(this.gameManager.limitedGameData[this.limitedTimeLobbyService.firstGame]);
            this.gameManager.limitedGameData.splice(this.limitedTimeLobbyService.firstGame, 1);
            this.gameName = this.gameManager.gameData.name;
            this.difficulty = this.displayService.convertDifficulty(this.gameManager.gameData);
            this.gameManager.putImages();
        }
        this.socketService.send('gamesNumber', { gamesNumber: this.gameManager.limitedGameData.length, roomId: this.limitedTimeLobbyService.roomId });
    }

    async ngAfterViewInit() {
        this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gameManager.putImages();
        this.socketService.on('LimitedDifferenceUpdate', async (data: { nbDifferences: number; newGame: number }) => {
            this.nbDifferencesFound = data.nbDifferences;
            await this.gameManager.initializeGame(this.gameManager.limitedGameData[data.newGame]);
            this.gameManager.putImages();
            this.putNewGame();
            this.gameManager.limitedGameData.splice(data.newGame, 1);
            if (this.nbDifferencesFound === this.gameManager.gameNumberMax) {
                this.endGame();
            }
        });
    }

    async putNewGame() {
        this.gameName = this.gameManager.gameData.name;
        this.difficulty = this.displayService.convertDifficulty(this.gameManager.gameData);
    }

    timer(gameTime: number) {
        const timerInterval = 1000;
        const max = 60;
        this.secondes = gameTime % max;
        this.minutes = Math.floor(gameTime / max);
        this.intervalID = window.setInterval(() => {
            gameTime--;
            this.secondes = gameTime % max;
            this.minutes = Math.floor(gameTime / max);
            if (this.minutes === 0 && this.secondes === 0) {
                this.endGame();
            }
        }, timerInterval);
    }

    startTimer(gameTime: number) {
        this.timer(gameTime);
    }

    stopTimer() {
        clearInterval(this.intervalID);
    }

    endGame(): void {
        clearInterval(this.intervalID);
        this.gameManager.playWinAudio();
        this.popUpWindow.nativeElement.style.display = 'block';
    }
    goToHomePage() {
        this.popUpWindow.nativeElement.style.display = 'none';
        this.router.navigate(['home']);
    }

    giveUp() {
        this.socketService.send('giveUp', { roomId: this.limitedTimeLobbyService.roomId });
        this.socketService.send('systemMessage', ' a abandonné la partie');
        this.stopTimer();
        this.goToHomePage();
    }

    goToGiveUp() {
        this.popUpWindowGiveUp.nativeElement.style.display = 'block';
    }

    goToStay() {
        this.popUpWindowGiveUp.nativeElement.style.display = 'none';
    }

    /// ////A adapter selon les joueurs
    async onClick(event: MouseEvent): Promise<void> {
        if (event.button === MouseButton.Left) {
            const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
            if (await this.gameManager.onPositionClicked(mousePosition)) {
                // Incrementer le cpt de differences
                this.socketService.send('limitedDifferenceFound', { roomId: this.limitedTimeLobbyService.roomId });
                // Si on a tout trouvé, finir le jeu.
            }
        }
    }
}
