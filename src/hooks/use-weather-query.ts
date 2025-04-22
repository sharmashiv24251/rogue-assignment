import { useQuery } from '@tanstack/react-query';

const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

type WeatherData = {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  timezone: number;
  dt: number;
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