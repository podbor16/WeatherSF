import React, { useState, useEffect } from "react";
import "../components/App.css";

const PLACES = [
  { name: 'Tomsk', zip: '94303' },
  { name: 'Biysk', zip: '94088' },
  { name: 'Novosibirsk', zip: '95062' },
  { name: 'Omsk', zip: '96803' }
];

const API_KEY = '0cb51d4efc218a29f4df6bc78ae1be0b';
const API_URL = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API_KEY}';

const WeatherDisplay = ({ zip }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await
fetch(`${API_URL}?q=${zip}&appid=${API_KEY}`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchWeatherData();
  }, [zip]);

  if (!weatherData) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const weather = weatherData.weather[0];
  const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

  return (
    <div>
      <h1>
        {weather.main} in {weatherData.name}
        <img src={iconUrl} alt={weatherData.description} />
      </h1>
      <p>Current: {weatherData.main.temp}°</p>
      <p>High: {weatherData.main.temp_max}°</p>
      <p>Low: {weatherData.main.temp_min}°</p>
      <p>Wind Speed: {weatherData.wind.speed} mi/hr</p>
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
      <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip} />
    </div>
  );
};

export default App;
