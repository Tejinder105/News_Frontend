import React, { useState, useEffect, useCallback } from "react";
import {
  CloudRain,
  Cloud,
  Sun,
  Thermometer,
  RefreshCw,
  MapPin,
  Droplets,
  Wind,
  Eye,
} from "lucide-react";
import Button from "./Button";

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = useCallback(async () => {
    if (!location.lat || !location.lon) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location.lat},${location.lon}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(`Failed to fetch weather: ${err.message}`);
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [location, API_KEY]);

  const getLocation = useCallback(() => {
    setError(null);
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        setError(`Location permission denied: ${err.message}`);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchWeather();
    }
  }, [location, fetchWeather]);

  const WeatherIcon = ({ condition }) => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("rain"))
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (conditionLower.includes("cloud"))
      return <Cloud className="h-8 w-8 text-gray-500" />;
    if (conditionLower.includes("sun") || conditionLower.includes("clear"))
      return <Sun className="h-8 w-8 text-yellow-500" />;

    return <Cloud className="h-8 w-8 text-gray-500" />;
  };

  const retryLocation = () => {
    setWeatherData(null);
    getLocation();
  };

  if (loading && !weatherData) {
    return (
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-2 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Thermometer className="h-5 w-5 text-blue-600" />
            Weather
          </h3>
          <div className="animate-spin">
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <div className="animate-pulse">
          <div className="mb-2 h-4 rounded bg-blue-200"></div>
          <div className="h-3 w-3/4 rounded bg-blue-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Thermometer className="h-5 w-5 text-blue-600" />
          Weather
        </h3>

        <Button
          variant="icon"
          onClick={fetchWeather}
          disabled={loading}
          loading={loading}
          iconLeft={!loading && <RefreshCw className="h-4 w-4 text-blue-600" />}
        />
      </div>

      {error && !weatherData ? (
        <div className="py-4 text-center">
          <div className="mb-2 text-sm text-red-500">{error}</div>
          <Button
            variant="primary"
            size="sm"
            onClick={retryLocation}
          >
            Retry Location
          </Button>
        </div>
      ) : weatherData ? (
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {weatherData.current.condition.icon ? (
                <img
                  src={weatherData.current.condition.icon}
                  alt={weatherData.current.condition.text}
                  className="h-12 w-12"
                />
              ) : (
                <WeatherIcon condition={weatherData.current.condition.text} />
              )}
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex flex-col">
                    <div className="text-2xl leading-tight font-bold text-gray-800">
                      {Math.round(weatherData.current.temp_c)}°C
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {weatherData.current.condition.text}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {weatherData.location.name}, {weatherData.location.region}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <WeatherMetric
              icon={<Droplets className="h-4 w-4 text-blue-500" />}
              label="Humidity"
              value={`${weatherData.current.humidity}%`}
            />

            <WeatherMetric
              icon={<Wind className="h-4 w-4 text-gray-500" />}
              label="Wind"
              value={`${Math.round(weatherData.current.wind_kph)} km/h`}
            />

            <WeatherMetric
              icon={<Eye className="h-4 w-4 text-purple-500" />}
              label="Visibility"
              value={`${weatherData.current.vis_km} km`}
            />

            <WeatherMetric
              icon={<Thermometer className="h-4 w-4 text-red-500" />}
              label="Feels like"
              value={`${weatherData.current.feelslike_c}°C`}
            />
          </div>

          {error && (
            <div className="text-center text-xs text-orange-600">{error}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

// Extracted metric component
const WeatherMetric = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2">
    {icon}
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  </div>
);

export default Weather;
