import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/message';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class DifferenceVerificationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    async differenceVerification(clickX: number, clickY: number, id: number) {
        const params = new HttpParams().set('ClickX', clickX).set('ClickY', clickY);
        this.http.get<Message>(this.baseUrl + `/difference/${id}`, { params }).pipe(catchError(this.handleError<Message>('differenceVerification')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
