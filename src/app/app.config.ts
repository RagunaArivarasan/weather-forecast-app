import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GlobalLoaderHttpInterceptor } from './core/interceptors/global-loader-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: GlobalLoaderHttpInterceptor, multi: true },
    provideAnimations(),
    provideToastr(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top'}))]
};
