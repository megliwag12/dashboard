import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Search, CloudRain, Thermometer, Wind, Droplets, ArrowDown, RefreshCw } from 'lucide-react';

interface WeatherData {
  name: string;
  country: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
}

type UnitType = 'imperial' | 'metric';

const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<UnitType>('imperial'); // 'imperial' for F, 'metric' for C

  // Mock weather data based on user input
  const generateWeatherData = (cityName: string): WeatherData | null => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return null;
    }
    
    // Generate realistic but simulated weather data
    const temp = Math.floor(Math.random() * 30) + (unit === 'imperial' ? 45 : 5);
    const feelsLike = temp + (Math.random() > 0.5 ? 2 : -2);
    const humidity = Math.floor(Math.random() * 30) + 50; // 50-80%
    const pressure = Math.floor(Math.random() * 40) + 1000; // 1000-1040 hPa
    const windSpeed = Math.floor(Math.random() * 15) + 5; // 5-20 mph or m/s
    
    // Weather conditions based on simulated temperature
    let condition, icon;
    if (temp > (unit === 'imperial' ? 80 : 27)) {
      condition = "Clear sky";
      icon = "01d";
    } else if (temp > (unit === 'imperial' ? 70 : 21)) {
      condition = "Partly cloudy";
      icon = "02d";
    } else if (temp > (unit === 'imperial' ? 60 : 15)) {
      condition = "Cloudy";
      icon = "03d";
    } else if (temp > (unit === 'imperial' ? 50 : 10)) {
      condition = "Light rain";
      icon = "10d";
    } else {
      condition = "Rain";
      icon = "09d";
    }
    
    // Create weather data object similar to what would come from an API
    return {
      name: cityName,
      country: "Demo",
      main: {
        temp: temp,
        feels_like: feelsLike,
        humidity: humidity,
        pressure: pressure
      },
      wind: {
        speed: windSpeed
      },
      weather: [
        {
          description: condition,
          icon: icon
        }
      ],
      sys: {
        sunrise: new Date().setHours(6, 0, 0, 0),
        sunset: new Date().setHours(18, 0, 0, 0)
      }
    };
  };

  const fetchWeather = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        const data = generateWeatherData(location);
        if (data) {
          setWeatherData(data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to generate weather data");
      } finally {
        setLoading(false);
      }
    }, 800); // Simulate network delay
  };

  const toggleUnit = () => {
    if (!weatherData) return;
    
    setUnit(prev => {
      const newUnit = prev === 'imperial' ? 'metric' : 'imperial';
      
      // Convert temperature values when toggling units
      setWeatherData(prevData => {
        if (!prevData) return null;
        
        const newTemp = newUnit === 'imperial' 
          ? (prevData.main.temp * 9/5) + 32 
          : (prevData.main.temp - 32) * 5/9;
          
        const newFeelsLike = newUnit === 'imperial'
          ? (prevData.main.feels_like * 9/5) + 32
          : (prevData.main.feels_like - 32) * 5/9;
          
        return {
          ...prevData,
          main: {
            ...prevData.main,
            temp: newTemp,
            feels_like: newFeelsLike
          }
        };
      });
      
      return newUnit;
    });
  };

  // Helper function to get weather icon URL
  const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">Weather</h1>
      
      <div className="flex items-center mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name"
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={fetchWeather}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center"
        >
          <Search size={18} />
        </button>
      </div>
      
      {loading && (
        <div className="text-center py-8 flex flex-col items-center">
          <RefreshCw size={30} className="animate-spin text-blue-500 mb-2" />
          <p>Loading weather data...</p>
        </div>
      )}
      
      {error && <div className="text-center text-red-500 py-4">{error}</div>}
      
      {!location && !weatherData && !loading && (
        <div className="text-center py-8 text-gray-500">
          <CloudRain size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Enter a city name to get weather information</p>
          <p className="text-xs mt-2">(Demo mode - generates simulated weather data)</p>
        </div>
      )}
      
      {weatherData && !loading && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {weatherData.name}
              <span className="text-sm ml-1 text-gray-500">(Demo)</span>
            </h2>
            <button 
              onClick={toggleUnit} 
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
            >
              {unit === 'imperial' ? '°F' : '°C'} ⇄ {unit === 'imperial' ? '°C' : '°F'}
            </button>
          </div>
          
          <div className="flex items-center mt-4">
            <img 
              src={getWeatherIconUrl(weatherData.weather[0].icon)}
              alt={weatherData.weather[0].description}
              className="w-16 h-16"
            />
            <div className="ml-2">
              <div className="text-3xl font-bold">
                {Math.round(weatherData.main.temp)}°{unit === 'imperial' ? 'F' : 'C'}
              </div>
              <div className="capitalize text-gray-600">
                {weatherData.weather[0].description}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg flex items-center">
              <Thermometer size={20} className="text-blue-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Feels Like</div>
                <div className="font-semibold">
                  {Math.round(weatherData.main.feels_like)}°{unit === 'imperial' ? 'F' : 'C'}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg flex items-center">
              <Droplets size={20} className="text-blue-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Humidity</div>
                <div className="font-semibold">{weatherData.main.humidity}%</div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg flex items-center">
              <Wind size={20} className="text-blue-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Wind</div>
                <div className="font-semibold">
                  {Math.round(weatherData.wind.speed)} {unit === 'imperial' ? 'mph' : 'm/s'}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg flex items-center">
              <div className="p-1 rounded-full bg-blue-100 mr-2">
                <ArrowDown size={18} className="text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pressure</div>
                <div className="font-semibold">{weatherData.main.pressure} hPa</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;