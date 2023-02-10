import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayGameService } from '@app/services/display-game.service';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-solo-view-page',
    templateUrl: './solo-view-page.component.html',
    styleUrls: ['./solo-view-page.component.scss'],
})
export class SoloViewPageComponent implements OnInit {
    username: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;

    constructor(private router: Router, private loginService: LoginFormService, private displayService: DisplayGameService) {}

    ngOnInit() {
        this.username = this.loginService.getFormData();
        this.displayService.loadGame('1');
        if (this.displayService.loadGame('1') === undefined) {
            return;
        }
        this.gameName = this.displayService.game.name;
        if (this.displayService.game.isDifficult) {
            this.difficulty = 'Niveau: difficile';
        } else {
            this.difficulty = 'Niveau: facile';
        }
        this.nbDifferences = this.displayService.game.nbDifferences;
    }

    returnSelectionPage(): void {
        this.router.navigate(['/gameSelection']);
    }
}
