import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 480;

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    context: CanvasRenderingContext2D;
    drawingContext: OffscreenCanvasRenderingContext2D;
    color: string = 'red';
    width: number = 8;
    isSquareEnabled: boolean = false;

    drawLine(startPosition: Vec2, endPosition: Vec2): void {
        this.drawingContext.save();
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(startPosition.x, startPosition.y);
        this.drawingContext.strokeStyle = this.color;
        this.drawingContext.lineWidth = this.width;
        this.drawingContext.lineTo(endPosition.x, endPosition.y);
        this.drawingContext.stroke();
        this.drawingContext.restore();
    }

    drawRectangle(startPosition: Vec2, endPosition: Vec2): void {
        this.drawingContext.save();
        this.drawingContext.fillStyle = this.color;
        let xLength = endPosition.x - startPosition.x;
        let yLength = endPosition.y - startPosition.y;

        if (this.isSquareEnabled) {
            if (Math.abs(xLength) >= Math.abs(yLength)) {
                xLength = xLength > 0 ? Math.abs(yLength) : -Math.abs(yLength);
            } else {
                yLength = yLength > 0 ? Math.abs(xLength) : -Math.abs(xLength);
            }
        }

        this.drawingContext.fillRect(startPosition.x, startPosition.y, xLength, yLength);
    }

    erase(position: Vec2): void {
        this.drawingContext.save();
        this.drawingContext.globalCompositeOperation = 'destination-over';
        this.drawingContext.fillStyle = 'rgba(0,0,0,0)';
        this.drawingContext.clearRect(
            Math.max(position.x - this.width, 0),
            Math.max(position.y - this.width, 0),
            Math.min(DEFAULT_WIDTH - position.x + this.width, this.width * 2),
            Math.min(DEFAULT_HEIGHT - position.y + this.width, this.width * 2),
        );
        this.drawingContext.restore();
    }
}
