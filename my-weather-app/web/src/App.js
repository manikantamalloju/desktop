import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const API_KEY = '1635890035cbba097fd5c26c8ea672a1';

  const fetchWeatherData = async (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    setIsLoading(true); 

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.cod !== '200') {
        setError('Failed to fetch data.');
        setIsLoading(false); 
        return;
      }
      setError(null);
      const forecast = data.list.map(item => ({
        date: item.dt_txt,
        tempMin: (item.main.temp_min - 273.15).toFixed(2),
        tempMax: (item.main.temp_max - 273.15).toFixed(2),
        pressure: item.main.pressure,
        humidity: item.main.humidity,
      }));
      setWeatherData(forecast);
    } catch (err) {
      console.error(err);
      setError('Error fetching weather data.');
    }
    setIsLoading(false); 
  };

  const handleSearch = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }
    
    setIsLoading(true); 

    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    try {
      const response = await fetch(geoApiUrl);
      const data = await response.json();
      
      if (data.length === 0) {
        setError('City not found');
        setIsLoading(false); 
        return;
      }
      const { lat, lon } = data[0];
      fetchWeatherData(lat, lon);
    } catch (err) {
      console.error(err);
      setError('Error fetching geolocation data.');
      setIsLoading(false); 
    }
  };

  return (
    <div className="app-container">
      <h1>Weather in your city</h1>
      <div className="search-container">
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter city name"
        />
        <button onClick={handleSearch} disabled={isLoading}>
          Search
        </button>
        {isLoading && <span className="loader"></span>} 
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="weather-container">
        {weatherData.map((data, index) => (
          <div key={index} className="weather-card">
            <h3>Date: {data.date}</h3>
            <table>
              <thead>
                <tr>
                  <th>Temperature</th>
                  <th>Min</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Temp</td>
                  <td>{data.tempMin}°C</td>
                  <td>{data.tempMax}°C</td>
                </tr>
                <tr>
                  <td>Pressure</td>
                  <td colSpan="2">{data.pressure} hPa</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td colSpan="2">{data.humidity}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
