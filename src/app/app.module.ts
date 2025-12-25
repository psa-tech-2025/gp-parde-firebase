import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarHeaderComponent } from './common/navbar-header/navbar-header.component';
import { FooterComponent } from './common/footer/footer.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './component/home/home.component';
import { GalleryComponent } from './component/gallery/gallery.component';
import { AboutCitizonComponent } from './component/about-citizon/about-citizon.component';
import { SCHEMESComponent } from './component/schemes/schemes.component';
import { OFFICERSComponent } from './component/officers/officers.component';
import { ReportsComponent } from './component/reports/reports.component';
import { LoginComponent } from './component/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { RegisterComponent } from './auth/register/register.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from '../environments/environment';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeAdminComponent } from './component/home-admin/home-admin.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarHeaderComponent,
    FooterComponent,
    HomeComponent,
    GalleryComponent,
    AboutCitizonComponent,
    SCHEMESComponent,
    OFFICERSComponent,
    ReportsComponent,
    LoginComponent,
    AboutUsComponent,
    RegisterComponent,
    SignInComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    HomeAdminComponent,
    SafeUrlPipe
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
        HttpClientModule,
          AngularFireModule.initializeApp(environment.firebase),
              AngularFireAuthModule,
                AngularFireStorageModule,
    
        
        TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'mr'   // ✅ Set Marathi as default
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
