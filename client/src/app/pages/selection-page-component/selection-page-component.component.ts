import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';

export type Game = {
    id: string;
    title: string;
    difficulty: string;
    image: string;
};

const display = 4;

@Component({
    selector: 'app-selection-page-component',
    templateUrl: './selection-page-component.component.html',
    styleUrls: ['./selection-page-component.component.scss'],
})
export class SelectionPageComponentComponent implements OnInit {
    componentNumber: number = 0;
    hasPrevious: boolean = false;
    hasNext: boolean = true;
    firstGame: number = 0;
    lastGame: number = display;
    marge: number = display;
    games: Game[];
    gamesDisplayed: Game[];

    constructor(private router: Router, private displayGames: DisplayGameService) {}

    async ngOnInit() {
        await this.checkGames();
    }

    async checkGames() {
        await this.displayGames.loadAllGames();
        if (this.displayGames.games !== undefined) {
            this.games = this.displayGames.games;
            this.gamesDisplayed = this.games.slice(this.firstGame, this.lastGame);
        }
    }

    goToHomePage(): void {
        this.router.navigate(['/home']);
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
}
