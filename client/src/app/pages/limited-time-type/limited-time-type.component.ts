import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-limited-time-type',
    templateUrl: './limited-time-type.component.html',
    styleUrls: ['./limited-time-type.component.scss'],
})
export class LimitedTimeTypeComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    goToSoloLimitedTime() {
        this.router.navigate(['/loginPage']);
    }
}
