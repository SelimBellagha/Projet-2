import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent implements AfterViewInit {
    @Input() customTitle: string;
    @Input() customDifficulty: string;
    @Input() isConfigurationMode: boolean;
    @Input() customPhoto: string;
    @Input() customId: string;
    @Input() multiplayerButton: string;
    @ViewChild('image') image: ElementRef<HTMLImageElement>;

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private displayService: DisplayGameService,
        private loginService: LoginFormService,
        private lobbyService: LobbyService,
    ) {}

    ngAfterViewInit(): void {
        this.image.nativeElement.src = this.customPhoto;
        this.lobbyService.host = false;
    }

    goToLoginPage(): void {
        this.displayService.loadGame(Number(this.customId));
        this.router.navigate(['/loginPage']);
    }

    playSolo() {
        this.loginService.setGameType(false);
        // this.loginService.setPlayerType(false);
        this.goToLoginPage();
    }

    playMultiplayer(): void {
        this.loginService.setGameId(this.customId);
        this.lobbyService.roomId = uuidv4();
        if (this.multiplayerButton === 'Créer') {
            this.loginService.setGameType(true);
            this.lobbyService.host = true;
            this.goToLoginPage();
        } else {
            this.loginService.setGameType(true);
            // this.loginService.setPlayerType(false);
            this.router.navigate(['/loginPage']);
            this.goToLoginPage();
        }
    }
}
