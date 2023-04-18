import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    username: string;
    constructor(private router: Router, private loginService: LoginFormService, private lobbyService: LobbyService) {}

    returnBack() {
        if (this.loginService.getLimitedTimeGame()) {
            this.goToLimitedType();
        } else {
            this.goToGameSelection();
        }
    }

    goToGameSelection(): void {
        this.router.navigate(['/gameSelection']);
    }

    goToLimitedType() {
        this.router.navigate(['/limitedTimeType']);
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
            if (this.loginService.getLimitedTimeGame()) {
                if (this.loginService.getGameType()) {
                    this.router.navigate(['/salleAttente']);
                } else {
                    this.router.navigate(['/soloLimitedTime']);
                }
            } else if (!this.loginService.getGameType()) {
                this.router.navigate(['/soloView']);
                this.lobbyService.roomId = '0';
            } else {
                this.router.navigate(['/salleAttente']);
            }
        }
    }

    validateUsername(name: string): boolean {
        return name !== '' && name.trim().length > 0;
    }
}
