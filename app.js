// Weather API configuration
const API_KEY = '4cda051dc1774f1e3510acdb30fb1bbd'; // Get from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Event Listeners
searchBtn.addEventListener('click', () => searchWeather());
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

/**
 * Search weather by city name
 */
async function searchWeather() {
    const cityName = cityInput.value.trim();

    if (!cityName) {
        showError('Please enter a city name');
        return;
    }

    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please set your API key in the app.js file');
        return;
    }

    hideError();
    showLoading();

    try {
        const weatherData = await fetchWeatherData(cityName);
        displayWeather(weatherData);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Fetch weather data from OpenWeatherMap API
 */
async function fetchWeatherData(cityName) {
    try {
        // Get coordinates from city name
        const geoResponse = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
        );

        if (!geoResponse.ok) {
            throw new Error('City not found. Please try another city.');
        }

        const weatherData = await geoResponse.json();
        
        // Fetch additional data (UV index, etc.)
        const { lat, lon } = weatherData.coord;
        const oneCallResponse = await fetch(
            `${API_BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        let additionalData = {};
        if (oneCallResponse.ok) {
            additionalData = await oneCallResponse.json();
        }

        return {
            ...weatherData,
            uvIndex: additionalData.current?.uvi || 'N/A'
        };
    } catch (error) {
        if (error.message.includes('not found')) {
            throw new Error('City not found. Please try another city.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
    }
}

/**
 * Display weather information on the page
 */
function displayWeather(data) {
    const { name, sys, main, weather, wind, clouds, visibility, coord } = data;
    const weatherCondition = weather[0];

    // Update location info
    document.getElementById('cityName').textContent = `${name}, ${sys.country}`;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update weather main info
    document.getElementById('temperature').textContent = `${Math.round(main.temp)}°C`;
    document.getElementById('weatherDescription').textContent = weatherCondition.description;
    
    // Update weather icon
    const iconCode = weatherCondition.icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    document.getElementById('weatherIcon').alt = weatherCondition.description;

    // Update details
    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('uvIndex').textContent = data.uvIndex !== 'N/A' ? data.uvIndex.toFixed(1) : 'N/A';

    // Show weather display
    weatherDisplay.classList.remove('hidden');
    cityInput.value = '';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    weatherDisplay.classList.add('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.remove('show');
}

/**
 * Show loading spinner
 */
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.remove('show');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

/**
 * Get user's location weather on page load (optional)
 */
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.log('Geolocation not available:', error);
            }
        );
    }
}

/**
 * Fetch weather by coordinates
 */
async function fetchWeatherByCoordinates(lat, lon) {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        return;
    }

    try {
        showLoading();
        const response = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await response.json();
        
        // Fetch additional data
        const oneCallResponse = await fetch(
            `${API_BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        let additionalData = {};
        if (oneCallResponse.ok) {
            additionalData = await oneCallResponse.json();
        }

        displayWeather({
            ...weatherData,
            uvIndex: additionalData.current?.uvi || 'N/A'
        });
    } catch (error) {
        console.error('Error fetching location weather:', error);
    } finally {
        hideLoading();
    }
}

// Uncomment the line below to auto-load weather based on user's location
// window.addEventListener('load', getLocationWeather);
