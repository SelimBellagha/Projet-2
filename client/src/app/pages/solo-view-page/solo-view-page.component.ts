import { Component, OnInit } from '@angular/core';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
    selector: 'app-solo-view-page',
    templateUrl: './solo-view-page.component.html',
    styleUrls: ['./solo-view-page.component.scss'],
})
export class SoloViewPageComponent implements OnInit {
    username: string;
    minutes: number = 0;
    secondes1: number = 0;
    secondes2: number = 0;
    minutes1: number = 0;
    minutes2: number = 0;

    constructor(private loginService: LoginFormService) {}

    ngOnInit() {
        this.username = this.loginService.getFormData();
        this.startTimer();
    }

    timer() {
        const decimalMax = 9;
        const centaineMax = 5;
        const timerInterval = 1000;
        setInterval(() => {
            if (this.secondes2 === centaineMax && this.secondes1 === decimalMax) {
                this.secondes2 = 0;
                this.secondes1 = 0;
                this.minutes1++;
            } else if (this.minutes1 === decimalMax) {
                this.minutes1 = 0;
                this.minutes2++;
            }
            if (this.secondes1 === decimalMax) {
                this.secondes2++;
                this.secondes1 = 0;
            } else {
                this.secondes1++;
            }
        }, timerInterval);
    }

    startTimer() {
        this.timer();
    }

    playDifferenceAudio() {
        number = 3000;
        const audio = new Audio();
        audio.src = '../../../assets/audio/DifferenceTrouvee.mp3';
        audio.load();
        audio.play();
        setInterval(() => {
            audio.pause();
        }, soundTime);
    }

    playWinAudio() {
        const audio = new Audio();
        audio.src = '../../../assets/audio/Win.mp3';
        audio.load();
        audio.play();
        setInterval(() => {
            audio.pause();
        }, 3000);
    }
}
