export interface BaseGame {
    name: string;
    originalImage: string;
    modifiedImage: string;
    differenceImage: string;
    nbDifferences: number;
    differences: unknown[][];
    isDifficult: boolean;
}

export interface Game extends BaseGame {
    id: string;
}
