import React, { useState, useEffect } from "react";
import "./App.css";

const PLACES = [
  { name: 'Томск', lat: 56.4977, lon: 84.9744 },
  { name: 'Бийск', lat: 52.5238, lon: 85.1621 },
  { name: 'Новосибирск', lat: 55.0415, lon: 82.9346 },
  { name: 'Омск', lat: 54.9914, lon: 73.3686 }
];

const API_KEY = 'c648259cb9a4bce84a29f745c43da88c';
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const WeatherDisplay = ({ lat, lon }) => {
	const [weatherData, setWeatherData] = useState(null);
	const [error, setError] = useState(null);
	const [selectedDay, setSelectedDay] = useState(0);

	useEffect(() => {
		const fetchWeatherData = async () => {
			try {
				const response = await fetch(
					`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
				);
				const data = await response.json();
				setWeatherData(data);
			} catch (error) {
				setError(error);
			}
		};
		fetchWeatherData();
	}, [lat, lon]);

	if (!weatherData) return <div className='loading'>Loading...</div>;
	if (error) return <div className='error'>Error: {error.message}</div>;

	// Группируем данные прогноза по дням, чтобы избежать дублирования
	const groupedForecast = weatherData.list.reduce((acc, item) => {
		const date = new Date(item.dt * 1000).toLocaleDateString();
		if (!acc[date]) {
			acc[date] = item;
		}
		return acc;
	}, {});

	const fiveDayForecast = Object.values(groupedForecast).slice(0, 5);

	const selectedForecast = fiveDayForecast[selectedDay];

	return (
		<div className='weather'>
			<h1>Погода в {weatherData.city.name}</h1>
			<p>
				<select
					value={selectedDay}
					onChange={e => setSelectedDay(e.target.value)}
				>
					{fiveDayForecast.map((day, index) => (
						<option key={index} value={index}>
							{new Date(day.dt * 1000).toLocaleDateString()}
						</option>
					))}
				</select>
			</p>

			<h2>Погода сейчас</h2>
			<p>Температура: {selectedForecast.main.temp}°C</p>
			<p>Влажность: {selectedForecast.main.humidity}%</p>
			<p>Скорость ветра: {selectedForecast.wind.speed} m/s</p>

			<h2>Прогноз на 5 дней</h2>
			<ul>
				{fiveDayForecast.map((day, index) => (
					<li key={index}>
						<p>Дата: {new Date(day.dt * 1000).toLocaleDateString()}</p>
						<p>Температура: {day.main.temp}°C</p>
						<p>Влажность: {day.main.humidity}%</p>
						<p>Скорость ветра: {day.wind.speed} m/s</p>
					</li>
				))}
			</ul>
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