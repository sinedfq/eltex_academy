import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { ARTICLES_SERVICE_TOKEN }
  from './core/services/articles/articles-service.token';

import { ArticlesService }
  from './core/services/articles/articles.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideClientHydration(
      withEventReplay()
    ),

    {
      provide: ARTICLES_SERVICE_TOKEN,
      useClass: ArticlesService
    }
  ]
};
