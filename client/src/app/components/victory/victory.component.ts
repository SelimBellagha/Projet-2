import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
})
export class VictoryComponent {
    constructor(private router: Router, private dialogRef: MatDialog) {}

    goToHomePage() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }

    stayForReplay(): void {
        this.dialogRef.closeAll();
    }
}
