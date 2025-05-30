import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard' 

// Define the routes for the application
export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '' } // Redirect to login for any unknown routes
];

@NgModule({
    imports: [RouterModule.forRoot(routes)], // Sets up the router with the defined routes
    exports: [RouterModule] // Exports the RouterModule so it can be used in the app
})

export class AppRoutingModule { }
