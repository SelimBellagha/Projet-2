import { Component, Input } from '@angular/core';
import { LoginFormService } from '@app/services/login-form.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

@Component({
    selector: 'app-join-bar',
    templateUrl: './join-bar.component.html',
    styleUrls: ['./join-bar.component.scss'],
})
export class JoinBarComponent {
    @Input() nomJoueur: string;
    @Input() socketId: string;

    constructor(private socketService: SocketClientService, private loginService: LoginFormService) {}

    refusePlayer() {
        console.log(1);
        this.socketService.send('removeFromQueue', { socketId: this.socketId, gameId: this.loginService.getGameId() });
    }

    acceptPlayer() {
        console.log(2);
        this.socketService.send('addToRoom', { socketId: this.socketId });
    }
}
