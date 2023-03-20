import { Injectable } from '@angular/core';
import { GameData } from '@app/interfaces/game-data';
import { Vec2 } from '@app/interfaces/vec2';
import { Verification } from '@app/interfaces/verification';
import { DifferenceVerificationService } from './difference-verification.service';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from './draw.service';

const PIXEL_SIZE = 4;
const FLASH_TIME = 250;
const ONE_SECOND = 1000;
@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    originalImageCanvas: CanvasRenderingContext2D;
    modifiedImageCanvas: CanvasRenderingContext2D;
    differencesFound: boolean[];
    gameData: GameData;
    lastDifferenceFound: number = 0;
    locked: boolean;

    constructor(private differenceVerification: DifferenceVerificationService) {}

    initializeGame(gameData: GameData) {
        if (gameData) {
            this.gameData = gameData;
            this.differencesFound = new Array<boolean>(gameData.nbDifferences).fill(false);
            this.lastDifferenceFound = -1; // change this
            this.locked = false;
        }
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
            if (await this.verifyDifference(position)) {
                this.locked = false;
                this.playDifferenceAudio();
                // Clignotement de tout les pixels faisant partie de la différence
                this.flashImages(this.gameData.differences[this.lastDifferenceFound]);
                return true;
            } else {
                // Écrire Erreur sur le canvas à la position
                // Bloquer les clics pendant 1 sec
                await this.errorMessage(position);
            }
            this.locked = false;
        }
        return false;
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
        // fait
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
