import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AboutCitizonComponent } from './component/about-citizon/about-citizon.component';
import { OFFICERSComponent } from './component/officers/officers.component';
import { SCHEMESComponent } from './component/schemes/schemes.component';
import { ReportsComponent } from './component/reports/reports.component';
import { LoginComponent } from './component/login/login.component';
import { GalleryComponent } from './component/gallery/gallery.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { RegisterComponent } from './auth/register/register.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeAdminComponent } from './component/home-admin/home-admin.component';

const routes: Routes = [
  {
    path:'', component:HomeComponent
  },
  {
    path:'gallery', component: GalleryComponent
  },
  // {
  //   path:'about-citizens', component:AboutCitizonComponent
  // },
  {
    path:'officers', component:OFFICERSComponent
  },
  {
    path:'schemes', component:SCHEMESComponent
  },

  {
    path:'reports', component: ReportsComponent
  },
  // {
  //   path:'login', component:LoginComponent
  // },
  {
    path:'about-us', component:AboutUsComponent
  },
  // {
  //   path:'sign-up',component:RegisterComponent,
  // },
  {
    path:'sign-in',component:SignInComponent,
  },
    { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
   {
     path: 'home-admin',
  component: HomeAdminComponent,
  // canActivate: [AuthGuard]
   }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
