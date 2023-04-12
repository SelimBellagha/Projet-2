export interface GameAction {
    actionType: GameActionType;
    time: number;
    info: object;
}

export enum GameActionType {
    Click,
    ActivateCheat,
    Hint,
    Message,
}
