import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    username: string;
    constructor(private router: Router, private loginService: LoginFormService) {}

    goToGameSelection(): void {
        this.router.navigate(['/gameSelection']);
    }

    onClickSubmit(name: string) {
        this.username = name;
        this.loginService.setFormData(this.username);
    }

    goToGamePage(): void {
        const input = document.getElementById('username') as HTMLInputElement;
        const name = input?.value;
        if (!this.validateUsername(name)) {
            window.alert('Nom de joueur invalide: entrez un nom non vide');
        } else {
            this.onClickSubmit(name);
            if (this.loginService.getGameType() === false) {
                this.router.navigate(['/soloView']);
            } else {
                this.router.navigate(['/salleAttente']);
            }
        }
    }

    validateUsername(name: string): boolean {
        return name !== '' && name.trim().length > 0;
    }
}
