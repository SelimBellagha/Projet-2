import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';
import { LobbyService } from '@app/services/lobby.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
export type Game = {
    id: string;
    title: string;
    difficulty: string;
    image: string;
    playerInGame: string;
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
    hasNext: boolean = false;
    hasNextPage: boolean = false;
    firstGame: number = 0;
    lastGame: number = display;
    marge: number = display;
    games: Game[];
    gamesDisplayed: Game[];

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private displayGames: DisplayGameService,
        private socketManager: SocketClientService,
        private lobbyService: LobbyService,
    ) {}

    async ngOnInit() {
        if (!this.socketManager.isSocketAlive()) {
            this.socketManager.connect();
        }
        await this.checkGames();
        this.lobbyService.deleteLobby();
    }

    async checkGames() {
        await this.displayGames.loadAllGames();
        if (this.displayGames.games !== undefined) {
            this.games = this.displayGames.games;
            this.gamesDisplayed = this.games.slice(this.firstGame, this.lastGame);
            this.checkPlayers();
            this.nextPage();
        }
    }

    goToHomePage(): void {
        this.router.navigate(['/home']);
    }

    nextPage(): void {
        if (this.games.length > display) {
            this.hasNextPage = true;
            this.hasNext = true;
        }
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

    checkPlayers() {
        for (const game of this.gamesDisplayed) {
            if (game.playerInGame === '0') {
                game.playerInGame = 'Créer';
            } else {
                game.playerInGame = 'Rejoindre';
            }
        }
    }
}
