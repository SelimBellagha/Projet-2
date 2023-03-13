import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';

type Game = {
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
    componentNumber: number = 0;
    hasPrevious: boolean = false;
    hasNext: boolean = false;
    hasNextPage: boolean = false;
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

    onClosingPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'none';
    }
}
