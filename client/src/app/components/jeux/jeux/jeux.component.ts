import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent implements AfterViewInit {
    @Input() customTitle: string;
    @Input() customDifficulty: string;
    @Input() isConfigurationMode: boolean;
    @Input() customPhoto: string;
    @Input() customId: string;
    @ViewChild('image') image: ElementRef<HTMLImageElement>;

    constructor(private router: Router, private displayService: DisplayGameService) {}

    ngAfterViewInit(): void {
        this.image.nativeElement.src = this.customPhoto;
    }

    goToLoginPage(): void {
        this.displayService.loadGame(Number(this.customId));
        this.router.navigate(['/loginPage']);
    }
}
