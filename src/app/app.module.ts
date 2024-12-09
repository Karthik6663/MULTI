import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { appRoutes } from './app.routes';

// Import your components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    AppComponent, // Import your standalone AppComponent here
    LoginComponent // Import your standalone LoginComponent here
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ],
})
export class AppModule { }
