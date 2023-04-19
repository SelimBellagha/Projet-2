import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-give-up',
    templateUrl: './give-up.component.html',
    styleUrls: ['./give-up.component.scss'],
})
export class GiveUpComponent {
    constructor(private router: Router, private dialogRef: MatDialog) {}

    goToStay() {
        this.dialogRef.closeAll();
    }

    giveUp() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }
}
