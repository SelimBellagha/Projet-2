import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-limited-time-type',
    templateUrl: './limited-time-type.component.html',
    styleUrls: ['./limited-time-type.component.scss'],
})
export class LimitedTimeTypeComponent implements OnInit {
    constructor(private router: Router, private loginService: LoginFormService) {}

    ngOnInit(): void {}

    goToSoloLimitedTime() {
        this.loginService.setGameType(false);
        this.router.navigate(['/loginPage']);
    }

    goToCoopLimitedTime() {
        this.loginService.setGameType(true);
        this.router.navigate(['/loginPage']);
    }
}
