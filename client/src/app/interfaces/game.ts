export interface Game {
    id: string;
    name: string;
    originalImage: string;
    modifiedImage: string;
    differenceImage: string;
    nbDifferences: number;
    differences: unknown[][];
    isDifficult: boolean;
}
