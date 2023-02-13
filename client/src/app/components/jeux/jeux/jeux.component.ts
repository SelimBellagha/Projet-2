import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';
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
    @Input() customId: string;

    constructor(private router: Router, private displayService: DisplayGameService) {}

    goToLoginPage(): void {
        this.displayService.setGameId(this.customId);
        this.displayService.loadGame();
        this.router.navigate(['/loginPage']);
    }
}
