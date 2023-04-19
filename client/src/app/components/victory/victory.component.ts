import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
})
export class VictoryComponent implements OnInit {
    constructor(private router: Router, private dialogRef: MatDialog) {}

    ngOnInit(): void {}

    goToHomePage() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }
}
