import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
// import { BlobOptions } from 'buffer';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent {
    @Input() customTitle: string;
    @Input() customDifficulty: string;
    @Input() isConfigurationMode: boolean;
    @Input() customPhoto: ImageBitmap;

    constructor(private router: Router) {}

    goToLoginPage(): void {
        this.router.navigate(['/loginPage']);
    }
}
