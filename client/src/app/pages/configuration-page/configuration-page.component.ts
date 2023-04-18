import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameHistory } from '@app/interfaces/game-history';
import { DisplayGameService } from '@app/services/display-game.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

export type Game = {
    id: string;
    title: string;
    difficulty: string;
    image: string;
};
const display = 4;

@Component({
    selector: 'app-configuration-page',
    templateUrl: './configuration-page.component.html',
    styleUrls: ['./configuration-page.component.scss'],
})
export class ConfigurationPageComponent implements OnInit {
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindow2') popUpWindow2: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindow3') popUpWindow3: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindow4') popUpWindow4: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindow5') popUpWindow5: ElementRef<HTMLDivElement>;
    componentNumber: number = 0;
    hasPrevious: boolean = false;
    hasNext: boolean = false;
    hasNextPage: boolean = false;
    firstGame: number = 0;
    lastGame: number = display;
    marge: number = display;
    games: Game[];
    gamesDisplayed: Game[];
    gameHistory: GameHistory[];

    constructor(private router: Router, private displayGames: DisplayGameService, private socketManager: SocketClientService) {}

    async ngOnInit() {
        if (!this.socketManager.isSocketAlive()) {
            this.socketManager.connect();
        }
        await this.checkGames();
    }

    async checkGames() {
        await this.displayGames.loadAllGames();
        if (this.displayGames.games) {
            this.games = this.displayGames.games;
            this.gamesDisplayed = this.games.slice(this.firstGame, this.lastGame);
            this.nextPage();
        }
    }

    goToHomePage(): void {
        this.router.navigate(['home']);
    }
    goToCreationPage(): void {
        this.router.navigate(['gameCreation']);
    }
    next(): void {
        this.gamesDisplayed = this.games.slice(this.lastGame, this.lastGame + this.marge);
        this.firstGame = this.lastGame;
        this.lastGame = this.lastGame + this.marge;
        this.hasPrevious = true;

        if (this.lastGame >= this.games.length) {
            this.hasNext = false;
        }
    }

    previous() {
        this.gamesDisplayed = this.games.slice(this.firstGame - this.marge, this.firstGame);
        this.lastGame = this.firstGame;
        this.firstGame = this.firstGame - this.marge;
        this.hasNext = true;

        if (this.firstGame === 0) {
            this.hasPrevious = false;
        }
    }

    nextPage(): void {
        if (this.games.length > display) {
            this.hasNext = true;
            this.hasNextPage = true;
        }
    }

    goToConstants(): void {
        this.popUpWindow.nativeElement.style.display = 'block';
    }

    goToReset(): void {
        this.popUpWindow2.nativeElement.style.display = 'block';
    }

    goToDelete(): void {
        this.popUpWindow3.nativeElement.style.display = 'block';
    }

    resetAllScores() {
        this.displayGames.resetAllScores();
        this.onClosingPopUp(2);
    }

    deleteAllGames() {
        this.onClosingPopUp(3);
    }

    async goToHistory() {
        await this.displayGames.getHistory();
        this.gameHistory = this.displayGames.history;
        this.popUpWindow4.nativeElement.style.display = 'block';
    }

    goToDeleteHistory() {
        this.popUpWindow5.nativeElement.style.display = 'block';
    }

    deleteHistory() {
        this.displayGames.deleteGameHistory();
        this.onClosingPopUp(5);
        this.onClosingPopUp(4);
    }

    onClosingPopUp(popUpNumber: number): void {
        switch (popUpNumber) {
            case 1: {
                this.popUpWindow.nativeElement.style.display = 'none';
                break;
            }
            case 2: {
                this.popUpWindow2.nativeElement.style.display = 'none';
                break;
            }
            case 3: {
                this.popUpWindow3.nativeElement.style.display = 'none';
                break;
            }
            case 4: {
                this.popUpWindow4.nativeElement.style.display = 'none';
                break;
            }
            case 5: {
                this.popUpWindow5.nativeElement.style.display = 'none';
                break;
            }
        }
    }
}
