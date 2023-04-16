export interface GameAction {
    type: GameActionType;
    time: number;
    info: object;
}

export enum GameActionType {
    Click,
    ActivateCheat,
    NormalHint,
    LastHint,
    Message,
    OpponentDifference,
}
