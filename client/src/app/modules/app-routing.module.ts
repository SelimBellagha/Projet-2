import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationPageComponent } from '@app/pages/configuration-page/configuration-page.component';
import { GameCreationPageComponent } from '@app/pages/game-creation-page/game-creation-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { SelectionPageComponentComponent } from '@app/pages/selection-page-component/selection-page-component.component';
import { SoloViewPageComponent } from '@app/pages/solo-view-page/solo-view-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'gameConfiguration', component: ConfigurationPageComponent },
    { path: 'gameCreation', component: GameCreationPageComponent },
    { path: 'soloView', component: SoloViewPageComponent },
    { path: 'gameSelection', component: SelectionPageComponentComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
