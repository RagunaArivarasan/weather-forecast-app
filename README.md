# Weather Forecast Application
This Angular application displays the current day's weather and a four-day forecast for a specified location. It utilizes the OpenWeatherMap API to fetch weather data, presenting it in a user-friendly format. To optimize performance, the application caches data in sessionStorage, retrieving four-day forecast only once per day for each user session.

## Table of Contents
	•	Features
	•	Technologies Used
	•	Setup
	•	Usage
	•	API Integration
 	•	Environment

## Features
•	Current Weather: Displays current weather conditions including temperature, humidity, and wind speed.
	•	4-Day Weather Forecast: Displays a 4-day weather forecast with details such as temperature, humidity, and wind speed.
	•	Session-based Caching: Weather data is stored in sessionStorage and is only refreshed once per day.
	•	SCSS Styling: The app uses SCSS for modular and maintainable styling.

## Technologies Used
	•	Angular: Front-end framework for building the application.
	•	TypeScript: Strongly typed programming language that builds on JavaScript.
	•	SCSS: CSS preprocessor for more organized and modular stylesheets.
	•	OpenWeatherMap API: API used to fetch the weather data.

## Setup
To run this project locally, follow these steps:
	•	Clone the repository: git clone https://github.com/RagunaArivarasan/weather-forecast-app.git
	•	Navigate to the project directory: cd weather-forecast-app
	•	Install dependencies: npm install
	•	Run the application: ng serve
	•	Open the application in your browser: Go to http://localhost:4200.
    	• 	Navigate to http://localhost:4200 to view the current day's weather data.
    	•  	Navigate to http://localhost:4200/four-days-forecast to view the upcoming 4-day weather forecast.

## Usage
	•	Visit the "/" route to view the current weather data.
	•	Visit the "/four-days-forecast" route to view the 4-day weather forecast.
	•	The weather data will automatically load and display.
	•	The data is stored in sessionStorage and will only refresh once per day.

## API Integration
The application integrates with the OpenWeatherMap API to fetch weather data.

## Environment
	•	Angular: 17.3.8
	•	Node: 18.13.0
	•	NPM: 8.19.3
This project requires a Node.js environment and the Angular CLI to run.
