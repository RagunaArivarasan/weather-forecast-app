import { Component, OnInit } from '@angular/core';
import { faMoon, faSun, faCloud, faCloudSun, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { WeatherService } from '../../core/services/weather.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { GlobalLoaderService } from '../../core/services/global-loader.service';
import { CommonModule } from '@angular/common';
import { ForecastData } from '../../core/models/forecast.model';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [FaIconComponent, CommonModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent implements OnInit {

  faMoon = faMoon;
  faSun = faSun;
  faCloud = faCloud;
  faCloudSun = faCloudSun;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  expandedRows: Array<boolean> = [];
  forecastData!: ForecastData;

  today = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

  dailyAverages: any[] = [];

  constructor(private weatherService: WeatherService, private toastr: ToastrService, private globalLoaderSvc: GlobalLoaderService) {
    this.expandedRows = new Array(this.dailyAverages?.length).fill(false);
  }

  ngOnInit() {
    this.globalLoaderSvc.setIsLoading(true);
    const lastFetched = sessionStorage.getItem('lastFetched');
    if (lastFetched !== this.today) {
      this.getLocation();
    } else {
      this.forecastData = JSON.parse(sessionStorage.getItem('forecastData') || '{}');
      this.dailyAverages = this.calculateDailyAverages(this.forecastData.list).slice(0, 4);
      this.globalLoaderSvc.setIsLoading(false);
    }
  }

  /** Retrieves the user's current location based on the browser's geolocation API.*/
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude,
            longitude } = position.coords;
          this.weatherService.fetchForecastData(latitude, longitude).subscribe(data => {
            this.forecastData = data;
            this.dailyAverages = this.calculateDailyAverages(this.forecastData.list).slice(0, 4);
            sessionStorage.setItem('forecastData', JSON.stringify(this.forecastData));
            sessionStorage.setItem('lastFetched', this.today);
            this.globalLoaderSvc.setIsLoading(false);
          });
        },
        (error) => {
          this.toastr.error('Error getting geolocation: ' + error);
          this.globalLoaderSvc.setIsLoading(false);
        }
      );
    }
  }

  /**Returns the appropriate weather icon based on the given weather code.*/
  getWeatherIcon(iconCode: string) {
    switch (iconCode) {
      case '01d':
        return faSun;
      case '01n':
        return faMoon;
      case '02d':
        return faCloudSun;
      default:
        return faCloud;
    }
  }

  /**Calculates the daily average temperature, humidity, and wind speed from a given weather data array.*/
  calculateDailyAverages(forecastList: any[]): any[] {
    const dayGroups = this.groupByDate(forecastList);
    const dailyAverages = Object.keys(dayGroups).map(date => {
      const dayData = dayGroups[date];
      const avgTemp = dayData.reduce((sum: any, item: any) => sum + item.main.temp, 0) / dayData.length;
      const avgHumidity = dayData.reduce((sum: any, item: any) => sum + item.main.humidity, 0) / dayData.length;
      const avgWindSpeed = dayData.reduce((sum: any, item: any) => sum + item.wind.speed, 0) / dayData.length;
      const minTemp = dayData.reduce((sum: any, item: any) => sum + item.main.temp_min, 0) / dayData.length;
      const maxTemp = dayData.reduce((sum: any, item: any) => sum + item.main.temp_max, 0) / dayData.length;
      const feelsLike = Math.min(...dayData.map((item: any) => item.main.feels_like));
      // Assuming the first entry's weather description and icon represent the day's average
      return {
        date,
        minTemp: minTemp.toFixed(2),
        maxTemp: maxTemp.toFixed(2),
        feelsLike: feelsLike.toFixed(2),
        avgTemp: avgTemp.toFixed(2),
        avgHumidity: avgHumidity.toFixed(2),
        avgWindSpeed: avgWindSpeed.toFixed(2),
        description: dayData[0].weather[0].description,
        icon: dayData[0].weather[0].icon
      };
    });

    return dailyAverages;
  }

  /**Groups a list of forecast data by date.*/
  groupByDate(forecastList: any[]): any {
    return forecastList.reduce((groups, item) => {
      const date = item.dt_txt.split(' ')[0]; // Extract the date part
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  }
}
