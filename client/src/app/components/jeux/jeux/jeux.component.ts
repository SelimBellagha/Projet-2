import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';
import { SocketClientService } from '@app/services/socket-client-service.service';

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

    constructor(private router: Router, private displayService: DisplayGameService, private socketService: SocketClientService) {}

    ngAfterViewInit(): void {
        this.image.nativeElement.src = this.customPhoto;
    }

    goToLoginPage(): void {
        this.displayService.loadGame(Number(this.customId));
        this.router.navigate(['/loginPage']);
    }

    playMultiplayer(): void {
        this.socketService.connect();
        this.socketService.send('handleGame', { roomName: this.customId });
        this.socketService.on('roomCreated', (data: { roomName: string }) => {
            if (data.roomName === this.customId) {
                console.log('the room was created');
            }
        });
        this.socketService.on('roomJoined', (data: { roomName: string }) => {
            if (data.roomName === this.customId) {
                console.log('you joined the room');
            }
        });
        this.socketService.on('roomFull', (data: { roomName: string }) => {
            if (data.roomName === this.customId) {
                console.log('the room is full');
            }
        });
    }
}
