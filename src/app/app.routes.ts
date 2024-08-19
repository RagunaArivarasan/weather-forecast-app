import { Routes } from '@angular/router';
import { CurrentWeatherComponent } from './features/current-weather/current-weather.component';

export const routes: Routes = [
  {
    path: '',
    component: CurrentWeatherComponent,
  },
  {
    path: 'four-days-forecast',
    loadComponent: () =>
      import('./features/forecast/forecast.component').then(
        (m) => m.ForecastComponent
      ),
  },
];
