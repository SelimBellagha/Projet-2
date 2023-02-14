import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Verification } from '@app/interfaces/verification';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class DifferenceVerificationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    async differenceVerification(clickX: number, clickY: number, id: number): Promise<Verification> {
        const params = new HttpParams().set('ClickX', clickX).set('ClickY', clickY);
        const source = this.http.get<Verification>(this.baseUrl + `/difference/${id}`, { params });
        const verif = await firstValueFrom(source);
        return verif;
    }
}
