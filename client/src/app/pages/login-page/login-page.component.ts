import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    constructor(private router: Router) {}

    goToGameSelection(): void {
        this.router.navigate(['/gameSelection']);
    }

    goToGamePage(): void {
        const input = document.getElementById('username') as HTMLInputElement;
        const name = input?.value;
        if (name === '') {
            window.alert('Nom de joueur invalide: entrez un nom non vide');
        } else {
            this.router.navigate(['/soloView']);
        }
    }
}
