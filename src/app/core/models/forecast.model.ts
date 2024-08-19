import { WeatherData } from './weather.model';

interface CityDetails {
  country: string;
  name: string;
  sunrise: number;
  sunset: number;
}

export interface ForecastData {
  list: WeatherData[];
  city: CityDetails;
}
