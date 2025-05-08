export class WeatherModule {
  constructor(containerId, apiKey = null) {
    this.container = document.getElementById(containerId);
    this.apiKey = apiKey || localStorage.getItem('weatherApiKey');
    this.weatherData = null;
    this.init();
  }

  init() {
    this.render();
    
    if (!this.apiKey) {
      this.promptForApiKey();
    } else {
      this.fetchWeather();
      // Update weather every 30 minutes
      setInterval(() => this.fetchWeather(), 30 * 60 * 1000);
    }
  }

  render() {
    this.container.innerHTML = '';
    
    if (this.weatherData) {
      const weatherInfo = document.createElement('div');
      weatherInfo.className = 'weather-info';
      
      const weatherIcon = document.createElement('img');
      weatherIcon.src = `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`;
      weatherIcon.alt = this.weatherData.weather[0].description;
      
      const weatherTemp = document.createElement('div');
      weatherTemp.className = 'weather-temp';
      weatherTemp.textContent = `${Math.round(this.weatherData.main.temp)}°C`;
      
      const weatherLocation = document.createElement('div');
      weatherLocation.className = 'weather-location';
      weatherLocation.textContent = this.weatherData.name;
      
      const weatherDescription = document.createElement('div');
      weatherDescription.className = 'weather-description';
      weatherDescription.textContent = this.weatherData.weather[0].description;
      
      const weatherDetails = document.createElement('div');
      weatherDetails.className = 'weather-details';
      
      const details = [
        { label: 'Feels like', value: `${Math.round(this.weatherData.main.feels_like)}°C` },
        { label: 'Humidity', value: `${this.weatherData.main.humidity}%` },
        { label: 'Wind', value: `${Math.round(this.weatherData.wind.speed)} m/s` },
        { label: 'Pressure', value: `${this.weatherData.main.pressure} hPa` }
      ];
      
      details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'weather-detail-item';
        
        const detailLabel = document.createElement('div');
        detailLabel.className = 'weather-detail-label';
        detailLabel.textContent = detail.label;
        
        const detailValue = document.createElement('div');
        detailValue.className = 'weather-detail-value';
        detailValue.textContent = detail.value;
        
        detailItem.appendChild(detailLabel);
        detailItem.appendChild(detailValue);
        weatherDetails.appendChild(detailItem);
      });
      
      weatherInfo.appendChild(weatherIcon);
      weatherInfo.appendChild(weatherTemp);
      weatherInfo.appendChild(weatherLocation);
      weatherInfo.appendChild(weatherDescription);
      weatherInfo.appendChild(weatherDetails);
      
      // Add update time
      const updateTime = document.createElement('div');
      updateTime.className = 'weather-update-time';
      updateTime.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
      updateTime.style.fontSize = '0.8rem';
      updateTime.style.marginTop = '1rem';
      updateTime.style.color = '#999';
      
      weatherInfo.appendChild(updateTime);
      
      this.container.appendChild(weatherInfo);
      
    } else if (!this.apiKey) {
      // Show API key form
      this.renderApiKeyForm();
    } else {
      // Show loading state
      const loadingEl = document.createElement('div');
      loadingEl.textContent = 'Loading weather data...';
      loadingEl.style.padding = '2rem';
      loadingEl.style.textAlign = 'center';
      
      this.container.appendChild(loadingEl);
    }
  }

  renderApiKeyForm() {
    const form = document.createElement('form');
    form.className = 'api-key-form';
    form.style.padding = '1rem';
    
    const helpText = document.createElement('p');
    helpText.textContent = 'Please enter your OpenWeatherMap API key:';
    helpText.style.marginBottom = '1rem';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'API Key';
    input.required = true;
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.marginBottom = '1rem';
    
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Save API Key';
    button.className = 'api-key-button';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#4285f4';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    form.appendChild(helpText);
    form.appendChild(input);
    form.appendChild(button);
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const apiKey = input.value.trim();
      if (apiKey) {
        this.saveApiKey(apiKey);
        this.fetchWeather();
      }
    });
    
    const link = document.createElement('a');
    link.href = 'https://openweathermap.org/api';
    link.target = '_blank';
    link.textContent = 'Get an API key here';
    link.style.display = 'block';
    link.style.marginTop = '1rem';
    link.style.fontSize = '0.9rem';
    
    this.container.appendChild(form);
    this.container.appendChild(link);
  }

  promptForApiKey() {
    this.renderApiKeyForm();
  }

  saveApiKey(apiKey) {
    this.apiKey = apiKey;
    localStorage.setItem('weatherApiKey', apiKey);
  }

  async fetchWeather() {
    if (!this.apiKey) return;
    
    try {
      // Try to get location
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Weather API error');
      }
      
      this.weatherData = await response.json();
      this.render();
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      
      // Handle error state
      const errorEl = document.createElement('div');
      errorEl.className = 'weather-error';
      errorEl.textContent = 'Could not fetch weather data. Please check your API key or try again later.';
      errorEl.style.padding = '1rem';
      errorEl.style.color = '#ff5252';
      
      const retryBtn = document.createElement('button');
      retryBtn.textContent = 'Retry';
      retryBtn.style.padding = '8px 16px';
      retryBtn.style.marginTop = '1rem';
      retryBtn.style.background = '#4285f4';
      retryBtn.style.color = 'white';
      retryBtn.style.border = 'none';
      retryBtn.style.borderRadius = '4px';
      retryBtn.style.cursor = 'pointer';
      
      retryBtn.addEventListener('click', () => this.fetchWeather());
      
      this.container.innerHTML = '';
      this.container.appendChild(errorEl);
      this.container.appendChild(retryBtn);
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10 * 60 * 1000 // 10 minutes
      });
    });
  }
}

export default WeatherModule;