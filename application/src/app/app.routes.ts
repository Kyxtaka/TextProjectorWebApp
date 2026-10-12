import { Routes } from '@angular/router';
import { IdentifierLoginPageComponent } from './feature/authentication/login/pages/identifier-login-page-component/identifier-login-page-component';
import { RegisterPage } from './feature/authentication/register/pages/register-page/register-page';
import { WelcomePageComponent } from './feature/home/pages/welcome-page/welcome-page';
import { ProjectionPageComponent } from './feature/projector/pages/projection-page/projection-page';
import { ProjectorControlPageComponent } from './feature/projector/pages/projector-control-page/projector-control-page';
import { SongManagementPageComponent } from './feature/content/song/pages/song-management-page/song-management-page';
import { authGuard } from './core/guard/auth/auth.guard';
export enum AppRoutes {
    HOME = "homecenter",
    LOGIN = "login",
    LOGINTEST = "logintest",
    REGISTER = "register",
    ADMIN_ACCOUNT_DASHBOARD = "admincenter/accountdashboard",
    ADMIN_ACCOUNT_LIST = "admincenter/accountlist",
    ADMIN_ACCOUNT_EDIT = "admincenter/accountedit", 
    PROJECTOR = "projector",
    SONGS = "songs",
}

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: AppRoutes.HOME,
    },
    {
        path: AppRoutes.HOME,
        component: WelcomePageComponent,
    },
    {
        path: AppRoutes.LOGIN,
        component: IdentifierLoginPageComponent,
    }
    ,
    {
        path: 'projection',
        component: ProjectionPageComponent,
    },
    {
        path: AppRoutes.PROJECTOR,
        component: ProjectorControlPageComponent,
        canActivate: [authGuard],
    },
    {
        path: AppRoutes.SONGS,
        component: SongManagementPageComponent,
        canActivate: [authGuard],
    },
    {
        path: AppRoutes.REGISTER,
        component: RegisterPage,
    },
    {
        path: '**',
        redirectTo: AppRoutes.HOME,
    }

];
