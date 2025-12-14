# Weather-App 
🌦️ Weather App

A modern, responsive Weather Forecast Web Application built using HTML, CSS, and JavaScript, powered by the OpenWeatherMap API. This application allows users to search for any city worldwide and view real-time weather details along with a 5-day forecast.


🚀 Features

🔍 Search weather by city name
🌡️ Real-time temperature (°C)
🤗 Feels-like temperature
💧 Humidity level
🌬️ Wind speed (km/h)
🔽 Atmospheric pressure
👁️ Visibility distance
☀️ UV Index
🗓️ 5-day weather forecast
⏳ Loading spinner for better UX
❌ Error handling for invalid city names
📱 Fully responsive design (mobile-friendly)



🛠️ Technologies Used

HTML5 – Structure of the application

CSS3 – Styling and responsive UI

JavaScript (ES6) – API handling and dynamic updates

OpenWeatherMap API – Weather and forecast data


⚙️ How It Works

1. User enters a city name in the search box.
2. On clicking Search (or pressing Enter):
Current weather data is fetched from the OpenWeatherMap API.
5-day forecast data is retrieved.
UV index is calculated using latitude & longitude.
3. The UI dynamically updates with weather details.
4. If the city is invalid, an error message is displayed.


🔑 API Configuration

This project uses the OpenWeatherMap API.

Steps to Get API Key:

1. Visit 👉 https://openweathermap.org/api
2. Create a free account
3. Generate your API key
4. Replace the API key in script.js
const API_KEY = 'YOUR_API_KEY_HERE';

