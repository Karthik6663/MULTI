import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appRoutes } from './app/app.routes';

const bootstrap = () => bootstrapApplication(AppComponent, {
  ...config,
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch())
  ]
});

export default bootstrap;