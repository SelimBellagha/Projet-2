import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-jeux',
    templateUrl: './jeux.component.html',
    styleUrls: ['./jeux.component.scss'],
})
export class JeuxComponent implements OnInit {
    @Input() customTitle: string;
    @Input() customDifficulty: string;
    constructor() {}
    ngOnInit(): void {}
}
