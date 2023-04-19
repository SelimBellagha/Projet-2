import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { Verification } from '@app/interfaces/verification';
import { DifferenceVerificationService } from './difference-verification.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './draw.service';
import { LimitedTimeLobbyService } from './limited-time-lobby.service';
import { SocketClientService } from './socket-client-service.service';

const PIXEL_SIZE = 4;
const FLASH_TIME = 250;
const ONE_SECOND = 1000;
const EIGHT = 8;
const QUART_SECOND = 250;
const pointY = 240;
const pointX = 250;

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    originalImageCanvas: CanvasRenderingContext2D;
    modifiedImageCanvas: CanvasRenderingContext2D;
    differencesFound: boolean[];
    gameData: GameData;
    limitedGameData: GameData[];
    gameNumberMax: number;
    // cheatMode: cheatMode;
    lastDifferenceFound: number = 0;
    locked: boolean;
    cheatState: boolean = false;
    hintState: boolean = false;
    foundDifferenceCheat: boolean = false;
    gameTime: number = 0;

    // eslint-disable-next-line max-params
    constructor(
        private differenceVerification: DifferenceVerificationService,
        private socketService: SocketClientService,
        private router: Router,
        private limitedTimeLobby: LimitedTimeLobbyService,
    ) {}

    initializeGame(gameData: GameData) {
        if (gameData) {
            this.gameData = gameData;
            this.differencesFound = new Array<boolean>(gameData.nbDifferences).fill(false);
            this.lastDifferenceFound = -1; // change this
            this.locked = false;
        }
    }

    initializeLimitedGame(limitedGameData: GameData[]) {
        if (limitedGameData) {
            this.limitedGameData = limitedGameData;
            this.gameNumberMax = this.limitedGameData.length;
            this.locked = false;
            if (this.router.url === '/soloLimitedTime') {
                this.initializeGame(this.getRandomGame());
            }
        }
    }

    getRandomGame(): GameData {
        const max = this.limitedGameData.length - 1;
        const min = 0;
        const gameNumber = Math.floor(Math.random() * (max - min + 1) + min);
        const game = this.limitedGameData[gameNumber];
        this.limitedGameData.splice(gameNumber, 1);
        return game;
    }

    async changeGame() {
        const newGame = this.getRandomGame();
        await this.initializeGame(newGame);
        this.putImages();
    }

    async putImages(): Promise<void> {
        if (this.gameData) {
            const testImage = new Image();
            testImage.src = this.gameData.originalImage;
            await testImage.decode();
            this.originalImageCanvas.drawImage(testImage, 0, 0);
            testImage.src = this.gameData.modifiedImage;
            await testImage.decode();
            this.modifiedImageCanvas.drawImage(testImage, 0, 0);
        }
    }

    async onPositionClicked(position: Vec2): Promise<boolean> {
        if (!this.locked) {
            this.locked = true;
            const now: Date = new Date();
            const timeString: string = now.toTimeString().slice(0, EIGHT);
            if (await this.verifyDifference(position)) {
                this.locked = false;
                this.playDifferenceAudio();
                this.socketService.send('systemMessage', '[' + timeString + '] ' + 'Différence trouvée par le joueur : ');
                this.socketService.send('systemMessageSolo', 'Différence trouvée ');
                await this.flashImages(this.gameData.differences[this.lastDifferenceFound]);
                if (this.router.url === '/soloLimitedTime') {
                    this.changeGame();
                }
                return true;
            } else {
                await this.errorMessage(position);
                this.socketService.send('systemMessage', '[' + timeString + '] ' + 'Erreur faite par le joueur : ');
                this.socketService.send('systemMessageSolo', 'Erreur ');
            }
            this.locked = false;
        }
        return false;
    }
    sendHintMessage(message: string): void {
        this.socketService.send('systemMessageSolo', message);
    }

    async verifyDifference(position: Vec2): Promise<boolean> {
        // code temporaire
        const verification: Verification = await this.differenceVerification.differenceVerification(position.x, position.y, this.gameData.id);
        if (verification.result) {
            if (!this.differencesFound[verification.index]) {
                this.differencesFound[verification.index] = true;
                this.lastDifferenceFound = verification.index;
                return true;
            }
        }
        return false;
    }
    async flashImages(pixels: Vec2[]): Promise<void> {
        this.flashPixels(pixels, this.originalImageCanvas);
        await this.flashPixels(pixels, this.modifiedImageCanvas);
        // Changer les pixels de droite pour qu'ils soient comme à gauche
        this.replacePixels(this.gameData.differences[this.lastDifferenceFound]);
    }
    async flashPixels(pixels: Vec2[], canvas: CanvasRenderingContext2D): Promise<void> {
        const originalImageData = canvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const flashingOriginalImageData = canvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        pixels.forEach((pixelPosition) => {
            const pixelStartPosition = PIXEL_SIZE * (pixelPosition.x + pixelPosition.y * DEFAULT_WIDTH);
            flashingOriginalImageData.data[pixelStartPosition] = 0;
            flashingOriginalImageData.data[pixelStartPosition + 1] = 0;
            flashingOriginalImageData.data[pixelStartPosition + 2] = 0;
            flashingOriginalImageData.data[pixelStartPosition + 3] = 255;
        });
        for (let i = 0; i <= 3; i++) {
            canvas.putImageData(flashingOriginalImageData, 0, 0);
            await this.wait(FLASH_TIME);
            canvas.putImageData(originalImageData, 0, 0);
            await this.wait(FLASH_TIME);
        }
    }

    async wait(ms: number): Promise<void> {
        await new Promise((res) => setTimeout(res, ms));
    }
    stateChanger(): void {
        this.cheatState = !this.cheatState;
    }
    hintStateChanger(): void {
        this.hintState = !this.hintState;
    }
    differenceCheatChanger(): void {
        this.foundDifferenceCheat = !this.foundDifferenceCheat;
    }

    async flashPixelsCheat(pixels: Vec2[][], canvas: CanvasRenderingContext2D): Promise<void> {
        const originalImageData = canvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const flashingOriginalImageData = canvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);

        for (let i = 0; i < this.gameData.nbDifferences; i++) {
            pixels[i].forEach((pixelPosition) => {
                const pixelStartPosition = PIXEL_SIZE * (pixelPosition.x + pixelPosition.y * DEFAULT_WIDTH);
                flashingOriginalImageData.data[pixelStartPosition] = 0;
                flashingOriginalImageData.data[pixelStartPosition + 1] = 0;
                flashingOriginalImageData.data[pixelStartPosition + 2] = 0;
                flashingOriginalImageData.data[pixelStartPosition + 3] = 255;
            });
        }

        while (this.cheatState) {
            if (this.foundDifferenceCheat) {
                const newOriginalImageData = canvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
                const newFlashingOriginalImageData = canvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
                this.replacePixels(this.gameData.differences[this.lastDifferenceFound]);
                for (let i = 0; i < this.gameData.nbDifferences; i++) {
                    if (!this.differencesFound[i]) {
                        pixels[i].forEach((pixelPosition) => {
                            const pixelStartPosition = PIXEL_SIZE * (pixelPosition.x + pixelPosition.y * DEFAULT_WIDTH);
                            flashingOriginalImageData.data[pixelStartPosition] = 0;
                            flashingOriginalImageData.data[pixelStartPosition + 1] = 0;
                            flashingOriginalImageData.data[pixelStartPosition + 2] = 0;
                            flashingOriginalImageData.data[pixelStartPosition + 3] = 255;
                        });
                    } else {
                        this.replacePixels(pixels[i]);
                    }
                }

                canvas.putImageData(newFlashingOriginalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(newOriginalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(newFlashingOriginalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(newOriginalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(newFlashingOriginalImageData, 0, 0);
                canvas.putImageData(newOriginalImageData, 0, 0);
            } else {
                canvas.putImageData(flashingOriginalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(originalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(flashingOriginalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(originalImageData, 0, 0);
                await this.wait(QUART_SECOND);
                canvas.putImageData(flashingOriginalImageData, 0, 0);
                canvas.putImageData(originalImageData, 0, 0);
            }
        }
        return;
    }
    drawLine(firstPoint: Vec2): void {
        // Copier les pixels dee l'image originale vers l'image modifiée
        const hintImage = this.originalImageCanvas;
        hintImage.moveTo(pointX, pointY);
        hintImage.lineTo(firstPoint.x, firstPoint.y);
        hintImage.stroke();
    }
    drawLine2(firstPoint: Vec2, endPoint: Vec2): void {
        // Copier les pixels dee l'image originale vers l'image modifiée
        const originalImageData = this.originalImageCanvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.originalImageCanvas.putImageData(originalImageData, 0, 0);
        this.originalImageCanvas.moveTo(firstPoint.x, firstPoint.y);
        this.originalImageCanvas.lineTo(endPoint.x, endPoint.y);
        this.originalImageCanvas.stroke();
    }

    giveHint3(coordinate: Vec2): void {
        this.originalImageCanvas.font = '30px Arial';
        this.originalImageCanvas.strokeText('Click Here', coordinate.x, coordinate.y);
    }

    timePenalty(): void {
        if (this.router.url === '/soloLimitedTime') {
            this.gameTime -= this.limitedTimeLobby.penaltyTime;
        } else if (this.router.url === '/soloView') {
            this.gameTime += this.limitedTimeLobby.penaltyTime;
        }
    }

    replacePixels(pixels: Vec2[]): void {
        // Copier les pixels dee l'image originale vers l'image modifiée
        const originalImageData = this.originalImageCanvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const modifiedImageData = this.modifiedImageCanvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        // traiter chaque position
        pixels.forEach((pixelPosition) => {
            const pixelStartPosition = PIXEL_SIZE * (pixelPosition.x + pixelPosition.y * DEFAULT_WIDTH);
            modifiedImageData.data[pixelStartPosition] = originalImageData.data[pixelStartPosition];
            modifiedImageData.data[pixelStartPosition + 1] = originalImageData.data[pixelStartPosition + 1];
            modifiedImageData.data[pixelStartPosition + 2] = originalImageData.data[pixelStartPosition + 2];
            modifiedImageData.data[pixelStartPosition + 3] = originalImageData.data[pixelStartPosition + 3];
        });
        this.modifiedImageCanvas.putImageData(modifiedImageData, 0, 0);
    }

    async errorMessage(position: Vec2): Promise<void> {
        this.playErrorAudio();
        // save originals
        const originalImageData = this.originalImageCanvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        const modifiedImageData = this.modifiedImageCanvas.getImageData(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        // put error
        this.drawError(this.originalImageCanvas, position);
        this.drawError(this.modifiedImageCanvas, position);
        await this.wait(ONE_SECOND);
        // restore Canvas
        this.originalImageCanvas.putImageData(originalImageData, 0, 0);
        this.modifiedImageCanvas.putImageData(modifiedImageData, 0, 0);
    }
    drawError(context: CanvasRenderingContext2D, position: Vec2): void {
        // Modifer pour que ce soit fait à la position du clic
        const startPosition: Vec2 = position;
        const step = 20;
        const word = 'ERREUR';
        context.font = '20px system-ui';
        context.fillStyle = 'Red';
        for (let i = 0; i < word.length; i++) {
            context.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    playWinAudio() {
        const soundTime = 3000;
        this.playAudio('../../../assets/audio/Win.mp3', soundTime);
    }
    playDifferenceAudio() {
        const soundTime = 3000;
        this.playAudio('../../../assets/audio/DifferenceTrouvee.mp3', soundTime);
    }
    playErrorAudio() {
        const soundTime = 3000;
        this.playAudio('../../../assets/audio/Error.mp3', soundTime);
    }

    playAudio(src: string, time: number): void {
        const soundTime = time;
        const audio = new Audio();
        audio.src = src;
        audio.load();
        audio.play();
        setInterval(() => {
            audio.pause();
        }, soundTime);
    }
}
