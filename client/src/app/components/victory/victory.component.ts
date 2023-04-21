import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameHistory } from '@app/interfaces/game-history';
import { TopScore } from '@app/interfaces/game.interface';
import { DisplayGameService } from '@app/services/display-game.service';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss'],
})
export class VictoryComponent {
    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            data1: GameHistory;
            data2: TopScore;
            data3: boolean;
        },
        private router: Router,
        private dialogRef: MatDialog,
        private displayService: DisplayGameService,
    ) {
        this.addHistoryAndScore();
    }

    addHistoryAndScore() {
        if (this.data.data3) {
            this.displayService.addHistory(this.data.data1);
            this.displayService.checkPlayerScore(this.data.data2);
        }
    }

    goToHomePage() {
        this.dialogRef.closeAll();
        this.router.navigate(['home']);
    }

    stayForReplay(): void {
        this.dialogRef.closeAll();
    }
}
