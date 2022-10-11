import {
  IOpenWeatherData,
  OpenWeatherTempScale,
} from '../types/open-weather-data.interface';
import { apiKey } from './apiKey';

export async function fetchOpenWeatherData(
  city: string,
  tempScale: OpenWeatherTempScale,
): Promise<IOpenWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempScale}&appid=${apiKey}`,
  );

  if (!res.ok) {
    throw new Error('City not found');
  }
  const data = await res.json();

  return data;
}
