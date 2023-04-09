import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationPageComponent } from '@app/pages/configuration-page/configuration-page.component';
import { GameCreationPageComponent } from '@app/pages/game-creation-page/game-creation-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { LimitedTimeTypeComponent } from '@app/pages/limited-time-type/limited-time-type.component';
import { LoginPageComponent } from '@app/pages/login-page/login-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { OneVsOneLimitedTimeComponent } from '@app/pages/one-vs-one-limited-time/one-vs-one-limited-time.component';
import { OneVsOnePageComponent } from '@app/pages/one-vs-one-page/one-vs-one-page.component';
import { SalleAttenteComponent } from '@app/pages/salle-attente/salle-attente.component';
import { SelectionPageComponentComponent } from '@app/pages/selection-page-component/selection-page-component.component';
import { SoloLimitedTimeComponent } from '@app/pages/solo-limited-time/solo-limited-time.component';
import { SoloViewPageComponent } from '@app/pages/solo-view-page/solo-view-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'config', component: ConfigurationPageComponent },
    { path: 'gameCreation', component: GameCreationPageComponent },
    { path: 'soloView', component: SoloViewPageComponent },
    { path: 'gameSelection', component: SelectionPageComponentComponent },
    { path: 'loginPage', component: LoginPageComponent },
    { path: 'oneVSone', component: OneVsOnePageComponent },
    { path: 'salleAttente', component: SalleAttenteComponent },
    { path: 'limitedOneVsOne', component: OneVsOneLimitedTimeComponent },
    { path: 'limitedTimeType', component: LimitedTimeTypeComponent },
    { path: 'soloLimitedTimeType', component: SoloLimitedTimeComponent },
    { path: '**', redirectTo: '/home' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
