import React, { useState, useEffect } from "react";
import "../components/App.css";

const PLACES = [
  { name: 'Tomsk', lat: 56.4977, lon: 84.9744 },
  { name: 'Biysk', lat: 52.5238, lon: 85.1621 },
  { name: 'Novosibirsk', lat: 55.0415, lon: 82.9346 },
  { name: 'Omsk', lat: 54.9914, lon: 73.3686 }
];

const API_KEY = '0cb51d4efc218a29f4df6bc78ae1be0b';
const API_URL = 'https://api.openweathermap.org/data/2.5/onecall';

const WeatherDisplay = ({ lat, lon, name }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchWeatherData();
  }, [lat, lon]);

  if (!weatherData) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

  return (
    <div>
      <h1>
        {weatherData.weather[0].main} in {name}
        <img src={iconUrl} alt={weatherData.weather[0].description} />
      </h1>
      <p>Current: {weatherData.main.temp}°C</p>
      <p>High: {weatherData.main.temp_max}°C</p>
      <p>Low: {weatherData.main.temp_min}°C</p>
      <p>Wind Speed: {weatherData.wind.speed} m/s</p>
    </div>
  );
};

const App = () => {
  const [activePlace, setActivePlace] = useState(0);

  return (
    <div className="App">
      {PLACES.map((place, index) => (
        <button
          key={index}
          onClick={() => setActivePlace(index)}
        >
          {place.name}
        </button>
      ))}
      <WeatherDisplay key={activePlace} lat={PLACES[activePlace].lat} lon={PLACES[activePlace].lon} name={PLACES[activePlace].name} />
    </div>
  );
};

export default App;