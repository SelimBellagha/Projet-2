import { Component } from '@angular/core';
import { Router } from '@angular/router';
type Game = {
    id: string;
    title: string;
    difficulty: string;
    image: string;
};

const GAMES_LIST: Game[] = [
    {
        id: '0',
        title: 'Jeu 1',
        difficulty: 'Facile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '1',
        title: 'Jeu 2',
        difficulty: 'Moyen',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '2',
        title: 'Jeu 3',
        difficulty: 'Facile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '3',
        title: 'Jeu 4',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '4',
        title: 'Jeu 5',
        difficulty: 'Moyen',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '5',
        title: 'Jeu 6',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '6',
        title: 'Jeu 7',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        id: '7',
        title: 'Jeu 8',
        difficulty: 'Moyen',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
];

const display = 4;

@Component({
    selector: 'app-selection-page-component',
    templateUrl: './selection-page-component.component.html',
    styleUrls: ['./selection-page-component.component.scss'],
})
export class SelectionPageComponentComponent {
    componentNumber: number = 0;
    games = GAMES_LIST;
    hasPrevious: boolean = false;
    hasNext: boolean = false;
    hasNextPage: boolean = false;
    firstGame: number = 0;
    lastGame: number = display;
    marge: number = display;
    gamesDisplayed = this.games.slice(this.firstGame, this.lastGame);

    constructor(private router: Router) {
        this.nextPage();
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
}
