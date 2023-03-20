import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationService } from '@app/services/communication.service';
import { DisplayGameService } from '@app/services/display-game.service';
import { LoginFormService } from '@app/services/login-form.service';

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
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;

    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private displayService: DisplayGameService,
        private loginService: LoginFormService,
        private comm: CommunicationService,
    ) {}

    ngAfterViewInit(): void {
        this.image.nativeElement.src = this.customPhoto;
    }

    goToLoginPage(): void {
        this.displayService.loadGame(this.customId);
        this.router.navigate(['/loginPage']);
    }

    playSolo() {
        this.loginService.setGameType(false);
        this.loginService.setPlayerType(false);
        this.goToLoginPage();
    }

    playMultiplayer(): void {
        this.loginService.setGameId(this.customId);
        if (this.multiplayerButton === 'Créer') {
            this.loginService.setGameType(true);
            this.loginService.setPlayerType(true);
            this.goToLoginPage();
        } else {
            this.loginService.setGameType(true);
            this.loginService.setPlayerType(false);
            this.router.navigate(['/loginPage']);
            this.goToLoginPage();
        }
    }

    goToPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'block';
    }

    deleteGame(): void {
        this.comm.deleteGame(this.customId);
        this.popUpWindow.nativeElement.style.display = 'none';
    }

    onClosingPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'none';
    }
}
