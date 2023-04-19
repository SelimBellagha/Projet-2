import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-time-off',
    templateUrl: './time-off.component.html',
    styleUrls: ['./time-off.component.scss'],
})
export class TimeOffComponent implements OnInit {
    constructor(private router: Router, private dialogRef: MatDialog) {}

    ngOnInit(): void {}

    goToHomePage() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }
}
