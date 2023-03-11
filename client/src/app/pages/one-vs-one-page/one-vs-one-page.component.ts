import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { DisplayGameService } from '@app/services/display-game.service';
import { GameManagerService } from '@app/services/game-manager.service';
import { LoginFormService } from '@app/services/login-form.service';

@Component({
  selector: 'app-one-vs-one-page',
  templateUrl: './one-vs-one-page.component.html',
  styleUrls: ['./one-vs-one-page.component.scss']
})

export class OneVsOnePageComponent implements OnInit {
  @ViewChild('modifiedImage') modifiedCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('originalImage') originalCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('popUpWindow') popUpWindow: ElementRef<HTMLDivElement>;
    username: string;
    gameName: string;
    difficulty: string;
    nbDifferences: number;
    nbDifferencesFound: number;
    minutes: number = 0;
    secondes1: number = 0;
    secondes2: number = 0;
    minutes1: number = 0;
    minutes2: number = 0;
    intervalID: number;


    /////
    user1:string = 'Yahya';
    user2:string = 'Selim';
    nbDifferencesFoundUser1:number = 3;
    nbDifferencesFoundUser2:number = 5;


    constructor(
      private router: Router,
      private loginService: LoginFormService,
      private displayService: DisplayGameService,
      private gameManager: GameManagerService,
  ) {}


    ngOnInit() {
      this.username = this.loginService.getFormData();
      this.startTimer();
      this.nbDifferencesFound = 0;
      if (this.displayService.game) {
          this.gameManager.initializeGame(this.displayService.game);
          this.gameName = this.displayService.game.name;
          this.difficulty = this.displayService.convertDifficulty(this.displayService.game);
          this.nbDifferences = this.displayService.game.nbDifferences;
      }
  }

  ngAfterViewInit() {
      this.gameManager.modifiedImageCanvas = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.gameManager.originalImageCanvas = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.gameManager.putImages();
  }

  timer() {
      const decimalMax = 9;
      const centaineMax = 5;
      const timerInterval = 1000;
      this.intervalID = window.setInterval(() => {
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

  stopTimer() {
      clearInterval(this.intervalID);
  }

  endGame(): void {
      this.stopTimer();
      this.gameManager.playWinAudio();
      this.popUpWindow.nativeElement.style.display = 'block';
  }

  goToHomePage() {
      this.popUpWindow.nativeElement.style.display = 'none';
      this.router.navigate(['home']);
  }

  goToCongratulations() {
      this.popUpWindow.nativeElement.style.display = 'block';
  }
  returnSelectionPage(): void {
      this.router.navigate(['/gameSelection']);
  }

  ///////A adapter selon les joueurs 
  async onClick(event: MouseEvent): Promise<void> {
    if (event.button === MouseButton.Left) {
        const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
        if (await this.gameManager.onPositionClicked(mousePosition)) {
            // Incrementer le cpt de differences
            this.nbDifferencesFound++;
            if (this.nbDifferences === this.nbDifferencesFound) {
                this.endGame();
            }
            // Si on a tout trouvé, finir le jeu.
        }
    }
}
}
