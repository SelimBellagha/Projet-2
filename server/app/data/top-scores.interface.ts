export interface TopScore {
    position: string;
    gameId: string;
    gameType: string;
    time: string;
    playerName: string;
}

export interface AddedScoreResult {
    isAdded: boolean;
    positionIndex: string;
}
