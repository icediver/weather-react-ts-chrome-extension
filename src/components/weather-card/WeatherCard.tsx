import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { fetchOpenWeatherData } from '../../utils/api';
import styles from './WeatherCard.scss';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Button,
  Grid,
} from '@material-ui/core';
import {
  IOpenWeatherData,
  OpenWeatherTempScale,
} from '../../types/open-weather-data.interface';
import { getWeatherIconSrc } from '../../utils/storage';

const WeatherCardContainer: FC<{
  // PropsWithChildren;
  children: ReactNode;
  onDelete?: () => void;
}> = ({ children, onDelete }) => {
  return (
    <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && (
            <Button color="secondary" onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

type WeatherCardState = 'loading' | 'error' | 'ready';

const WeatherCard: FC<{
  city: string;
  tempScale: OpenWeatherTempScale;
  onDelete?: () => void;
}> = ({ city, tempScale, onDelete }) => {
  const [weatherData, setWeatherData] = useState<IOpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>('loading');

  useEffect(() => {
    fetchOpenWeatherData(city, tempScale)
      .then(data => {
        setWeatherData(data);
        setCardState('ready');
      })
      .catch(err => setCardState('error'));
  }, [city, tempScale]);

  if (cardState == 'loading' || cardState == 'error') {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className={styles.title}>{city}</Typography>
        <Typography className={styles.body}>
          {cardState == 'loading'
            ? 'loading...'
            : 'Error: could not retrieve weather data for this city.'}
        </Typography>
      </WeatherCardContainer>
    );
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography className={styles.title}>{weatherData.name}</Typography>
          <Typography className={styles.temp}>
            {Math.round(weatherData.main.temp)}
          </Typography>
          <Typography variant="body1">
            Feels like: {Math.round(weatherData.main.feels_like)}
          </Typography>
        </Grid>
        <Grid item>
          {weatherData.weather.length > 0 && (
            <>
              <img src={getWeatherIconSrc(weatherData.weather[0].icon)} />
              <Typography className={styles.body}>
                {weatherData.weather[0].main}
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer>
  );
};

export default WeatherCard;
