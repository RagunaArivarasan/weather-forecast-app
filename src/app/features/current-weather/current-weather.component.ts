import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WeatherData } from '../../core/models/weather.model';
import { WeatherService } from '../../core/services/weather.service';
import { faCloud, faCloudSun, faMoon, faRefresh, faSun } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { GlobalLoaderService } from '../../core/services/global-loader.service';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent {
  weatherData!: WeatherData;
  locationForm: FormGroup = {} as FormGroup;
  backgroundImage = 'url(./assets/images/clear.webp)';

  faRefresh = faRefresh;
  faMoon = faMoon;
  faSun = faSun;
  faCloud = faCloud;
  faCloudSun = faCloudSun;

  constructor(
    private weatherService: WeatherService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private globalLoaderSvc: GlobalLoaderService
  ) {}

  ngOnInit() {
    this.globalLoaderSvc.setIsLoading(true);
    this.getLocation();
    this.locationForm = this.fb.group({
      city: ['', Validators.required],
    });
  }

  /**Handle form submission here.*/
  onSubmit() {
    if (this.locationForm.invalid) {
      return;
    }
    const { city } = this.locationForm.value;
    this.weatherService.getCurrentWeatherByCity(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.toastr.success('Successfully fetched weather data!');
        this.setbackgroundImageBasedOnWeather();
      },
      error: (error) => {
        let errorMessage;
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            errorMessage = 'Invalid API key.';
          } else if (error.status === 404) {
            errorMessage = 'City not found.';
          } else {
            errorMessage =
              'An error occurred while fetching weather data. Please try again later.';
          }
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
        this.toastr.error(errorMessage);
      },
    });
  }

  /**Returns the appropriate weather icon based on the given weather code.*/
  getWeatherIcon(iconCode: string): any {
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

  /** Retrieves the user's current location based on the browser's geolocation API.*/
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.weatherService.getCurrentWeather(latitude, longitude).subscribe({
            next: (data) => {
              this.weatherData = data;
              this.toastr.success('Successfully fetched weather data!');
              this.setbackgroundImageBasedOnWeather();
            },
            error: (error) => {
              let errorMessage;
              if (error instanceof HttpErrorResponse) {
                if (error.status === 401 || error.status === 403) {
                  errorMessage = 'Invalid API key.';
                } else if (error.status === 404) {
                  errorMessage = 'City not found.';
                } else {
                  errorMessage =
                    'An error occurred while fetching weather data. Please try again later.';
                }
              } else {
                errorMessage = 'An unexpected error occurred.';
              }
              this.toastr.error(errorMessage);
            },
          });
        },
        (error) => {
          this.toastr.error('Error getting geolocation: ' + error);
          this.globalLoaderSvc.setIsLoading(false);
        }
      );
    }
  }

  /**Sets the background image of the specified element based on the current weather conditions.*/
  setbackgroundImageBasedOnWeather() {
    // Setting background image based on weather condition
    if (this.weatherData) {
      const weatherCondition = this.weatherData.weather[0].main.toLowerCase();
      switch (weatherCondition) {
        case 'clear':
          this.backgroundImage = 'url(./assets/images/clear.webp)';
          break;
        case 'clouds':
          this.backgroundImage = 'url(./assets/images/cloudy_sky.jpg)';
          break;
        case 'rain':
          this.backgroundImage = 'url(./assets/images/rainy.jpg)';
          break;
        default:
          this.backgroundImage = 'url(./assets/images/clear.webp)';
      }
    }
  }

  /**Clears all form controls and sets them back to their initial values.*/
  resetForm() {
    this.locationForm.reset();
    this.globalLoaderSvc.setIsLoading(true);
    this.getLocation();
  }
}
