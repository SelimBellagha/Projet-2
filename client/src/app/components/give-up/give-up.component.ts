import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-give-up',
    templateUrl: './give-up.component.html',
    styleUrls: ['./give-up.component.scss'],
})
export class GiveUpComponent implements OnInit {
    constructor(private router: Router, private dialogRef: MatDialog) {}

    ngOnInit(): void {}

    goToStay() {
        this.dialogRef.closeAll();
    }

    giveUp() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }
}
