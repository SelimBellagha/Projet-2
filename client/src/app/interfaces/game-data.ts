import { Vec2 } from './vec2';

export interface GameData {
    name: string;
    originalImage: ImageBitmap;
    modifiedImage: ImageBitmap;
    differenceImage: ImageData;
    nbDifferences: number;
    differences: Vec2[][];
    isDifficult: boolean;
}
