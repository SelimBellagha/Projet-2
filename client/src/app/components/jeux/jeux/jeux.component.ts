import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent {
    @Input() customTitle: string;
    @Input() customDifficulty: string;

    constructor(private router: Router) {}

    goToLoginPage(): void {
        this.router.navigate(['/loginPage']);
    }
}
