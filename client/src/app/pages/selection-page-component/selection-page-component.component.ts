import { Component } from '@angular/core';
import { Router } from '@angular/router';
type Game = {
    title: string;
    difficulty: string;
    image: string;
};

const GAMES_LIST: Game[] = [
    {
        title: 'Jeu 1',
        difficulty: 'Facile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 2',
        difficulty: 'Moyen',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 3',
        difficulty: 'Facile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 4',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 5',
        difficulty: 'Moyen',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 6',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 7',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 8',
        difficulty: 'Moyen',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 9',
        difficulty: 'Facile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 10',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
    {
        title: 'Jeu 11',
        difficulty: 'Difficile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
];

@Component({
    selector: 'app-selection-page-component',
    templateUrl: './selection-page-component.component.html',
    styleUrls: ['./selection-page-component.component.scss'],
})
export class SelectionPageComponentComponent {
    games = GAMES_LIST;
    gameslenght: number = this.games.length;
    hasprevious: boolean = false;
    hasnext: boolean = true;
    protected firstgame: number = 0;
    protected lastgame: number = 4;
    gamesDisplayed = this.games.slice(this.firstgame, this.lastgame);
    protected marge: number = 4;

    constructor(private router: Router) {}

    goToHomePage(): void {
        this.router.navigate(['/home']);
    }

    next(): void {
        this.gamesDisplayed = this.games.slice(this.lastgame, this.lastgame + this.marge);
        this.firstgame = this.lastgame;
        this.lastgame = this.lastgame + this.marge;
        this.hasprevious = true;

        if (this.lastgame === this.gameslenght) {
            this.hasnext = false;
        }
    }

    previous() {
        this.gamesDisplayed = this.games.slice(this.firstgame - this.marge, this.firstgame);
        this.lastgame = this.firstgame;
        this.firstgame = this.firstgame - this.marge;
        this.hasnext = true;

        if (this.firstgame === 0) {
            this.hasprevious = false;
        }
    }
}
