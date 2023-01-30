import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent {
    @Input() customTitle: string;
    @Input() customDifficulty: string;
}
