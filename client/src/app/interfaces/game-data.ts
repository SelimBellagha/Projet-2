import { Vec2 } from './vec2';

export interface GameData {
    id: string;
    name: string;
    // originalImage: ImageBitmap;
    // modifiedImage: ImageBitmap;
    originalImage: string;
    modifiedImage: string;
    // differenceImage: ImageData;
    nbDifferences: number;
    differences: Vec2[][];
    isDifficult: boolean;
}
