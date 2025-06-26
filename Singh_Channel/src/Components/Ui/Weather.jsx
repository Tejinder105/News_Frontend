import React, { useState, useEffect } from "react";

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = "3c11adf205c44902b3b94958250906"; // Move to .env in production

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
        },
        (err) => {
          setError("Permission denied or location unavailable.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchWeather();
    }
  }, [lat, lon]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${api}&q=${lat},${lon}&aqi=no`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(`Failed to fetch weather data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm rounded-lg bg-white p-2 shadow-md">
      <h2 className="text-xl font-semibold">Current Weather</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weatherData && !error ? (
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-black">
                {weatherData.current.temp_c}°C
              </span>
              <span className="text-sm text-gray-600">
                {weatherData.location.name}, {weatherData.location.region}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">
              {weatherData.current.condition.text}
            </span>
            <span className="text-xs font-medium text-gray-500">
              Humidity: {weatherData.current.humidity}%
            </span>
            <span className="text-xs font-medium text-gray-500">
              Wind: {weatherData.current.wind_kph} kph
            </span>
          </div>
        </div>
      ) : null}
    
    </div>
  );
}

export default Weather;
