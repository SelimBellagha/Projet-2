import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-time-off',
    templateUrl: './time-off.component.html',
    styleUrls: ['./time-off.component.scss'],
})
export class TimeOffComponent {
    constructor(private router: Router, private dialogRef: MatDialog) {}
    goToHomePage() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }
}
