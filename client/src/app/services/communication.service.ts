import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddedScoreResult } from '@app/interfaces/added-score-result';
import { GameHistory } from '@app/interfaces/game-history';
import { GameData, TopScore } from '@app/interfaces/game.interface';
import { Constants } from '@common/constants';
import { Message } from '@common/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http.get<Message>(this.baseUrl + '/example').pipe(catchError(this.handleError<Message>('basicGet')));
    }

    getDate(): Observable<Date> {
        return this.http.get<Date>(this.baseUrl + '/date');
    }

    getAllGames(): Observable<GameData[]> {
        return this.http.get<GameData[]>(`${this.baseUrl}/games`).pipe(catchError(this.handleError<GameData[]>('getAllGames')));
    }

    getGameById(id: string): Observable<GameData> {
        const params = new HttpParams().set('id', id);
        return this.http.get<GameData>(`${this.baseUrl}/games/${id}`, { params });
    }

    basicPost(message: Message): Observable<HttpResponse<string>> {
        return this.http.post(this.baseUrl + '/example/send', message, { observe: 'response', responseType: 'text' });
    }

    addNewGame(game: GameData): void {
        this.http.post(`${this.baseUrl}/games/send`, game).subscribe();
    }

    deleteGame(id: string): void {
        const params = new HttpParams().set('id', id);
        this.http.delete(`${this.baseUrl}/games/${id}`, { params }).subscribe();
    }

    sendConstants(gameConstants: Constants): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/games/constants`, gameConstants).pipe(catchError(this.handleError<void>('sendConstants')));
    }

    getConstants(): Observable<Constants> {
        return this.http.get<Constants>(this.baseUrl + '/games/constants').pipe(catchError(this.handleError<Constants>('getConstants')));
    }

    getAllScores(): Observable<TopScore[]> {
        return this.http.get<TopScore[]>(`${this.baseUrl}/scores`);
    }

    getGameScores(gameId: string, gameType: string): Observable<TopScore[]> {
        const params = new HttpParams().set('gameId', gameId).set('gameType', gameType);
        return this.http.get<TopScore[]>(`${this.baseUrl}/scores/${gameId}/${gameType}`, { params });
    }

    addScore(score: TopScore): Observable<AddedScoreResult> {
        return this.http.post<AddedScoreResult>(`${this.baseUrl}/scores`, score);
    }

    resetGameScores(gameId: string): void {
        const params = new HttpParams().set('gameId', gameId);
        this.http.delete(`${this.baseUrl}/scores/${gameId}`, { params }).subscribe();
    }

    getGameHistory(): Observable<GameHistory[]> {
        return this.http.get<GameHistory[]>(`${this.baseUrl}/history`).pipe(catchError(this.handleError<GameHistory[]>('getGameHistory')));
    }

    addNewGameHistory(gameHistory: GameHistory): void {
        this.http.post(`${this.baseUrl}/history`, gameHistory).subscribe();
    }

    deleteGameHistory(): void {
        this.http.delete(`${this.baseUrl}/history`).subscribe();
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
