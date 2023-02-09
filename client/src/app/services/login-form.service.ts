import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginFormService {
    private username: string;

    setFormData(name: string) {
        this.username = name;
    }

    getFormData() {
        return this.username;
    }
}
