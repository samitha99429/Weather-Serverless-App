import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import axios from 'axios';
import schema from './schema';

const weather: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const city = event.queryStringParameters?.city;

  if (!city) {
    return formatJSONResponse({
      error: "missing city parameter"
    });
  }

  try {


    const apiKey = process.env.WEATHER_API_KEY;


    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

    return formatJSONResponse({
      city: response.data.name,
      temperature: response.data.main.temp,
      weather: response.data.weather[0].description,
      humidity: response.data.main.humidity
    });

  } catch (error) {
    return formatJSONResponse({
      message: "Error fetching weather details",
      error: error.message
    });
  }
};

export const main = middyfy(weather);
