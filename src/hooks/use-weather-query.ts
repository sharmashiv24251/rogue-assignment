import { useQuery } from '@tanstack/react-query';

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';


  type WeatherData = {
    coord: {
      lon: number; // Longitude
      lat: number; // Latitude
    };
    weather: Array<{
      id: number; // Weather condition id
      main: string; // Group of weather parameters (Rain, Snow, Clouds etc.)
      description: string; // Weather condition within the group
      icon: string; // Weather icon id
    }>;
    base: string; // Internal parameter
    main: {
      temp: number; // Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
      feels_like: number; // Temperature accounting for human perception.
      temp_min: number; // Minimum temperature at the moment.
      temp_max: number; // Maximum temperature at the moment.
      pressure: number; // Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa
      humidity: number; // Humidity, %
      sea_level?: number; // Atmospheric pressure on the sea level, hPa (Optional)
      grnd_level?: number; // Atmospheric pressure on the ground level, hPa (Optional)
    };
    visibility: number; // Visibility, meter. The maximum value of the visibility is 10km
    wind: {
      speed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
      deg: number; // Wind direction, degrees (meteorological)
      gust?: number; // Wind gust. Unit Default: meter/sec (Optional)
    };
    clouds: {
      all: number; // Cloudiness, %
    };
    dt: number; // Time of data calculation, unix, UTC
    sys: {
      // type?: number; // Internal parameter (Optional)
      // id?: number; // Internal parameter (Optional)
      country: string; // Country code (GB, JP etc.)
      sunrise: number; // Sunrise time, unix, UTC
      sunset: number; // Sunset time, unix, UTC
    };
    timezone: number; // Shift in seconds from UTC
    id: number; // City ID
    name: string; // City name
    cod: number; // Internal parameter (status code)
  };
  

export const useWeatherQuery = (city: string) => {
  return useQuery<WeatherData>({
    queryKey: ['weather', city],
    queryFn: async () => {
      if (!city) throw new Error('City is required');
      
      const response = await fetch(
        `${WEATHER_API_BASE_URL}?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      return response.json();
    },
    
      enabled: Boolean(city),
      staleTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
};