import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    isLeftButtonDown: boolean;
    firstPosition: Vec2;
    currentPosition: Vec2;
    isLeftSelected: boolean;

    setFirstClick(clickPosition: Vec2, isLeftImage: boolean): void {
        this.isLeftButtonDown = true;
        this.firstPosition = clickPosition;
        this.currentPosition = clickPosition;
        this.isLeftSelected = isLeftImage;
    }

    updatePosition(mousePosition: Vec2) {
        this.currentPosition = mousePosition;
    }

    endClick() {
        this.isLeftButtonDown = false;
    }
    getCurrentPosition(): Vec2 {
        return this.currentPosition;
    }
    getFirstPosition(): Vec2 {
        return this.firstPosition;
    }
    isLeftCanvasSelected(): boolean {
        return this.isLeftSelected;
    }
    isButtonDown(): boolean {
        return this.isLeftButtonDown;
    }
}
