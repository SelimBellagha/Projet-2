/* eslint-disable @typescript-eslint/naming-convention */
import { Games } from './games.interface';

export const gamesData: Games = {
    0: {
        id: '0',
        name: 'Jeu 1',
        originalImage: './assets/image_2_diff.bmp',
        modifiedImage: './assets/image_7_diff.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: false,
    },
    1: {
        id: '1',
        name: 'Jeu 2',
        originalImage: './assets/image_3_diff_radius.bmp',
        modifiedImage: './assets/image_2_diff.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: true,
    },
    2: {
        id: '2',
        name: 'Jeu 3',
        originalImage: './assets/image_7_diff.bmp',
        modifiedImage: './assets/image_12_diff.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: true,
    },
    3: {
        id: '3',
        name: 'Jeu 4',
        originalImage: './assets/image_12_diff.bmp',
        modifiedImage: './assets/image_3_diff_radius.bmp',
        differenceImage: '',
        nbDifferences: 7,
        differences: [],
        isDifficult: false,
    },
};
