import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-limited-time-type',
    templateUrl: './limited-time-type.component.html',
    styleUrls: ['./limited-time-type.component.scss'],
})
export class LimitedTimeTypeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    goToSoloLimitedTime() {
        console.log(1);
    }
}
