import { Vec2 } from './vec2';

export interface GameData {
    id: string;
    name: string;
    originalImage: string;
    modifiedImage: string;
    nbDifferences: number;
    differences: Vec2[][];
    isDifficult: boolean;
}

export interface TopScore {
    position: string;
    gameId: string;
    gameType: string;
    time: string;
    playerName: string;
}
