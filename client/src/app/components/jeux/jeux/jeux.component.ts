import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TopScore } from '@app/interfaces/game.interface';
import { CommunicationService } from '@app/services/communication.service';
import { DisplayGameService } from '@app/services/display-game.service';
import { LobbyService } from '@app/services/lobby.service';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent implements AfterViewInit, OnInit {
    @Input() customTitle: string;
    @Input() customDifficulty: string;
    @Input() isConfigurationMode: boolean;
    @Input() customPhoto: string;
    @Input() customId: string;
    @Input() multiplayerButton: string;
    @ViewChild('image') image: ElementRef<HTMLImageElement>;
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    @ViewChild('popUpWindow2') popUpWindow2: ElementRef<HTMLDivElement>;
    soloScores: TopScore[];
    oneVOneScores: TopScore[];
    // Nécéssaire pour que le component puisse avoir tous les services dont il a besoin
    // eslint-disable-next-line max-params
    constructor(
        private router: Router,
        private displayService: DisplayGameService,
        private loginService: LoginFormService,
        private lobbyService: LobbyService,
        private comm: CommunicationService,
        private socketService: SocketClientService,
    ) {}

    ngAfterViewInit(): void {
        this.image.nativeElement.src = this.customPhoto;
        this.lobbyService.host = false;
        this.holdUpdateLobbyAvailability();
    }

    ngOnInit(): void {
        this.loadSoloScores();
        this.load1v1Scores();
    }

    loadSoloScores() {
        this.comm.getGameScores(this.customId, 'solo').subscribe((scores: TopScore[]) => (this.soloScores = scores));
    }

    load1v1Scores() {
        this.comm.getGameScores(this.customId, '1v1').subscribe((scores: TopScore[]) => (this.oneVOneScores = scores));
    }

    goToLoginPage(): void {
        this.displayService.loadGame(this.customId);
        this.router.navigate(['/loginPage']);
    }

    playSolo() {
        this.loginService.setGameType(false);
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
            this.loginService.setPlayerType(false);
            this.goToLoginPage();
        }
    }

    goToPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'block';
    }

    goToPopUp2(): void {
        this.popUpWindow2.nativeElement.style.display = 'block';
    }

    deleteGame(): void {
        this.comm.deleteGame(this.customId);
        this.onClosingPopUp();
    }

    resetGameScores(): void {
        this.comm.resetGameScores(this.customId);
        this.onClosingPopUp2();
    }

    onClosingPopUp(): void {
        this.popUpWindow.nativeElement.style.display = 'none';
    }

    onClosingPopUp2(): void {
        this.popUpWindow2.nativeElement.style.display = 'none';
    }

    holdUpdateLobbyAvailability() {
        this.socketService.on('updatePlayers', (data: { gameId: string; available: boolean }) => {
            if (data.gameId === this.customId) {
                if (data.available) {
                    this.multiplayerButton = 'Rejoindre';
                } else {
                    this.multiplayerButton = 'Créer';
                }
            }
        });
    }
}
