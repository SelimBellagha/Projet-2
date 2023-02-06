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
        difficulty: 'Facile',
        image: 'https://www.jardiner-malin.fr/wp-content/uploads/2015/02/tilleul-arbre.jpg',
    },
];

@Component({
    selector: 'app-configuration-page',
    templateUrl: './configuration-page.component.html',
    styleUrls: ['./configuration-page.component.scss'],
})
export class ConfigurationPageComponent {
    games = GAMES_LIST;

    constructor(private router: Router) {}

    goToHomePage(): void {
        this.router.navigate(['home']);
    }
    goToCreationPage(): void {
        this.router.navigate(['gameCreation']);
    }
}
