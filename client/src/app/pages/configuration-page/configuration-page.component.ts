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
    @ViewChild('popUpResetScores') popUpResetScores: ElementRef<HTMLDivElement>;
    @ViewChild('popUpDeleteGames') popUpDeleteGames: ElementRef<HTMLDivElement>;
    @ViewChild('popUpHistory') popUpHistory: ElementRef<HTMLDivElement>;
    @ViewChild('popUpDeleteHistory') popUpDeleteHistory: ElementRef<HTMLDivElement>;
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

    goToReset(): void {
        this.popUpResetScores.nativeElement.style.display = 'block';
    }

    goToDelete(): void {
        this.popUpDeleteGames.nativeElement.style.display = 'block';
    }

    resetAllScores() {
        this.displayGames.resetAllScores();
        this.onClosingPopUp('reset');
    }

    deleteAllGames() {
        this.displayGames.deleteAllGames();
        this.onClosingPopUp('deleteGames');
    }

    async goToHistory() {
        await this.displayGames.getHistory();
        this.gameHistory = this.displayGames.history;
        this.popUpHistory.nativeElement.style.display = 'block';
    }

    goToDeleteHistory() {
        this.popUpDeleteHistory.nativeElement.style.display = 'block';
    }

    deleteHistory() {
        this.displayGames.deleteGameHistory();
        this.onClosingPopUp('deleteHistory');
        this.onClosingPopUp('history');
    }

    onClosingPopUp(popUpName: string): void {
        switch (popUpName) {
            case 'reset': {
                this.popUpResetScores.nativeElement.style.display = 'none';
                break;
            }
            case 'deleteGames': {
                this.popUpDeleteGames.nativeElement.style.display = 'none';
                break;
            }
            case 'history': {
                this.popUpHistory.nativeElement.style.display = 'none';
                break;
            }
            case 'deleteHistory': {
                this.popUpDeleteHistory.nativeElement.style.display = 'none';
                break;
            }
        }
    }
}
