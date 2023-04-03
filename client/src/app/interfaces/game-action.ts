export interface GameAction {
    actionType: GameActionType;
    time: number;
}

export enum GameActionType {
    Click,
    ActivateCheat,
    DeactivateCheat,
    Hint,
}
