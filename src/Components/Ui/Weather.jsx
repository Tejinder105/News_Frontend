@@ .. @@
 import React, { useState, useEffect } from "react";
-import { CloudRain, Cloud, Sun, Thermometer, RefreshCw, MapPin, Droplets, Wind, Eye } from "lucide-react";
+import { CloudRain, Cloud, Sun, Thermometer, RefreshCw, MapPin, Droplets, Wind, Eye, AlertTriangle } from "lucide-react";
 
 function Weather() {
   const [weatherData, setWeatherData] = useState(null);
   const [lat, setLat] = useState(null);
   const [lon, setLon] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [lastUpdated, setLastUpdated] = useState(null);
-  const api = "3c11adf205c44902b3b94958250906"; // Move to .env in production
+  const [retryCount, setRetryCount] = useState(0);
+  const api = import.meta.env.VITE_WEATHER_API_KEY || "3c11adf205c44902b3b94958250906";
 
   useEffect(() => {
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           const { latitude, longitude } = position.coords;
           setLat(latitude);
           setLon(longitude);
         },
         (err) => {
-          setError("Permission denied or location unavailable.");
+          setError("Location access denied. Please enable location services.");
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
     setError(null);
     try {
       const response = await fetch(
         `https://api.weatherapi.com/v1/current.json?key=${api}&q=${lat},${lon}&aqi=no`
       );
-      if (!response.ok) throw new Error("Network response was not ok");
+      if (!response.ok) {
+        if (response.status === 401) {
+          throw new Error("Invalid API key");
+        } else if (response.status === 403) {
+          throw new Error("API quota exceeded");
+        }
+        throw new Error(`Weather service error: ${response.status}`);
+      }
       const data = await response.json();
       setWeatherData(data);
-      console.log(data);
       setLastUpdated(new Date());
+      setRetryCount(0);
     } catch (error) {
-      setError(`Failed to fetch weather data: ${error.message}`);
+      console.error("Weather fetch error:", error);
+      setError(error.message);
+      setRetryCount(prev => prev + 1);
     } finally {
       setLoading(false);
     }
   };
 
   const refreshWeather = () => {
     if (lat && lon) fetchWeather();
   };
 
   const getWeatherIcon = (condition) => {
     const conditionLower = condition.toLowerCase();
     if (conditionLower.includes("rain"))
       return <CloudRain className="h-8 w-8 text-blue-500" />;
     if (conditionLower.includes("cloud"))
       return <Cloud className="h-8 w-8 text-gray-500" />;
     if (conditionLower.includes("sun") || conditionLower.includes("clear"))
       return <Sun className="h-8 w-8 text-yellow-500" />;
     return <Cloud className="h-8 w-8 text-gray-500" />;
   };
 
   if (loading) {
     return (
-      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm">
+      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
         <div className="mb-4 flex items-center justify-between">
           <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
             <Thermometer className="h-5 w-5 text-blue-600" />
             Weather
           </h3>
           <div className="animate-spin">
             <RefreshCw className="h-4 w-4 text-blue-600" />
           </div>
         </div>
         <div className="animate-pulse space-y-3">
-          <div className="mb-2 h-4 rounded bg-blue-200"></div>
-          <div className="h-3 w-3/4 rounded bg-blue-200"></div>
+          <div className="h-4 rounded bg-blue-200"></div>
+          <div className="h-3 w-3/4 rounded bg-blue-200"></div>
+          <div className="grid grid-cols-2 gap-2">
+            <div className="h-12 rounded bg-blue-200"></div>
+            <div className="h-12 rounded bg-blue-200"></div>
+          </div>
         </div>
       </div>
     );
   }
 
   return (
-    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
-      <div className="mb-1 flex items-center justify-between">
+    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
+      <div className="mb-4 flex items-center justify-between">
         <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
           <Thermometer className="h-5 w-5 text-blue-600" />
           Weather
         </h3>
-        <div
+        <button
           onClick={refreshWeather}
-          className="transition-color rounded-lg p-1.5 duration-200 hover:bg-blue-100"
+          disabled={loading}
+          className="rounded-lg p-2 transition-colors duration-200 hover:bg-blue-200 disabled:opacity-50"
+          aria-label="Refresh weather"
         >
-          <RefreshCw className="h-4 w-4 text-blue-600" />
-        </div>
-        {error && !weatherData && (
-          <div className="py-4 text-center">
-            <div className="mb-1 text-sm text-red-500">{error}</div>
-            <button
-              onClick={refreshWeather}
-              className="text-xs text-blue-600 underline hover:text-blue-800"
-            >
-              Try Again
-            </button>
-          </div>
-        )}
+          <RefreshCw className={`h-4 w-4 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
+        </button>
       </div>
 
+      {error && !weatherData && (
+        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center">
+          <div className="mb-2 flex items-center justify-center gap-2">
+            <AlertTriangle className="h-4 w-4 text-red-500" />
+            <span className="text-sm font-medium text-red-700">Weather Unavailable</span>
+          </div>
+          <div className="mb-2 text-xs text-red-600">{error}</div>
+          {retryCount < 3 && (
+            <button
+              onClick={refreshWeather}
+              className="text-xs text-red-600 underline hover:text-red-800"
+            >
+              Try Again ({3 - retryCount} attempts left)
+            </button>
+          )}
+        </div>
+      )}
+
       {weatherData && (
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               {weatherData.current.condition.icon ? (
                 <img
                   src={weatherData.current.condition.icon}
                   alt={weatherData.current.condition.text}
-                  className="h-12 w-12"
+                  className="h-12 w-12 drop-shadow-sm"
                 />
               ) : (
                 getWeatherIcon(weatherData.current.condition.text)
               )}
               <div>
                 <div className="text-2xl font-bold text-gray-800">
                   {Math.round(weatherData.current.temp_c)}°C
                 </div>
                 <div className="text-sm text-gray-600 capitalize">
                   {weatherData.current.condition.text}
                 </div>
               </div>
             </div>
-          <div className="flex items-center gap-2 text-sm text-gray-600">
+          </div>
+          
+          <div className="flex items-center gap-2 text-sm text-gray-600">
             <MapPin className="h-4 w-4" />
             <span>
               {weatherData.location.name}, {weatherData.location.region}
             </span>
           </div>
-          </div>
 
-          <div className="grid grid-cols-2 gap-3">
+          <div className="mt-4 grid grid-cols-2 gap-3">
             <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2">
               <Droplets className="h-4 w-4 text-blue-500" />
               <div>
                 <div className="text-xs text-gray-500">Humidity</div>
                 <div className="text-sm font-medium">
                   {weatherData.current.humidity}%
                 </div>
               </div>
             </div>
 
             <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2">
               <Wind className="h-4 w-4 text-gray-500" />
               <div>
                 <div className="text-xs text-gray-500">Wind</div>
                 <div className="text-sm font-medium">
                   {Math.round(weatherData.current.wind_kph)} km/h
                 </div>
               </div>
             </div>
 
             <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2">
               <Eye className="h-4 w-4 text-purple-500" />
               <div>
                 <div className="text-xs text-gray-500">Visibility</div>
                 <div className="text-sm font-medium">
                   {weatherData.current.vis_km} km
                 </div>
               </div>
             </div>
 
             <div className="flex items-center gap-2 rounded-lg bg-white/50 p-2">
               <Thermometer className="h-4 w-4 text-red-500" />
               <div>
                 <div className="text-xs text-gray-500">Feels like</div>
                 <div className="text-sm font-medium">
                   {weatherData.current.feelslike_c}°C
                 </div>
               </div>
             </div>
           </div>
+          
           {lastUpdated && (
             <div className="border-t border-blue-200 pt-2 text-center text-xs text-gray-500">
               Updated: {lastUpdated.toLocaleTimeString()}
             </div>
           )}
 
           {error && weatherData && (
             <div className="text-center text-xs text-orange-600">{error}</div>
           )}
         </div>
       )}
     </div>
   );
 }
 
 export default Weather;