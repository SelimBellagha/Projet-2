import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-selection-page-component',
    templateUrl: './selection-page-component.component.html',
    styleUrls: ['./selection-page-component.component.scss'],
})
export class SelectionPageComponentComponent {
    constructor(private router: Router) {}

    goToHomePage(): void {
        this.router.navigate(['/home']);
    }
}
