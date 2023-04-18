import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { Constants, MAX_BONUS_TIME, MAX_INIT_TIME, MAX_PENALTY_TIME, MIN_BONUS_TIME, MIN_INIT_TIME, MIN_PENALTY_TIME } from '@common/constants';
@Component({
    selector: 'app-constants',
    templateUrl: './constants.component.html',
    styleUrls: ['./constants.component.scss'],
})
export class ConstantsComponent implements OnInit {
    // @Output() constants: Constants;
    protected initTime: number;
    protected penaltyTime: number;
    protected timeBonus: number;

    constructor(private readonly communicationService: CommunicationService) {}

    ngOnInit() {
        this.getConstantsFromServer();
    }

    getConstants(): Constants {
        return { initTime: this.initTime, penaltyTime: this.penaltyTime, timeBonus: this.timeBonus };
    }

    default(): void {
        this.initTime = 30;
        this.penaltyTime = 5;
        this.timeBonus = 5;
        this.sendConstants();
    }

    verifyConstants(constants: Constants): boolean {
        if (constants.initTime < MIN_INIT_TIME || constants.initTime > MAX_INIT_TIME) {
            window.alert('veuillez entrer un chiffre compris entre 30 et 120');
            return false;
        }
        if (constants.penaltyTime < MIN_PENALTY_TIME || constants.penaltyTime > MAX_PENALTY_TIME) {
            window.alert('veuillez entrer un chiffre compris entre 1 et 15');
            return false;
        }
        if (constants.timeBonus < MIN_BONUS_TIME || constants.timeBonus > MAX_BONUS_TIME) {
            window.alert('veuillez entrer un chiffre compris entre 1 et 15');
            return false;
        }
        return true;
    }

    getConstantsFromServer(): void {
        this.communicationService.getConstants().subscribe({
            next: (constants: Constants) => {
                this.initTime = constants.initTime;
                this.penaltyTime = constants.penaltyTime;
                this.timeBonus = constants.timeBonus;
            },
        });
    }

    sendConstants(): void {
        const constants = this.getConstants();
        if (this.verifyConstants(constants)) {
            this.communicationService.sendConstants(constants).subscribe({});
            window.alert('Les constantes de jeu sont mise à jour');
        }
    }
}
