import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LimitedTimeLobbyService } from '@app/services/limited-time-lobby.service';

@Component({
    selector: 'app-give-up',
    templateUrl: './give-up.component.html',
    styleUrls: ['./give-up.component.scss'],
})
export class GiveUpComponent {
    constructor(private router: Router, private dialogRef: MatDialog, private limitedLobby: LimitedTimeLobbyService) {}

    goToStay() {
        this.dialogRef.closeAll();
    }

    giveUp() {
        if (this.router.url === '/soloLimitedTime' || this.router.url === '/limitedOneVsOne') {
            clearInterval(this.limitedLobby.timerId);
        }
        this.dialogRef.closeAll();
        this.router.navigate(['/home']);
    }
}
