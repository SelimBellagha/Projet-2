import { Component, OnInit } from '@angular/core';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-solo-view-page',
    templateUrl: './solo-view-page.component.html',
    styleUrls: ['./solo-view-page.component.scss'],
})
export class SoloViewPageComponent implements OnInit {
    username: string;

    constructor(private loginService: LoginFormService) {}

    ngOnInit() {
        this.username = this.loginService.getFormData();
    }
}
