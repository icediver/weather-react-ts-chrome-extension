import ReactDOM from 'react-dom/client';
import './popup.module.scss';
import 'fontsource-roboto';
import {
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@material-ui/icons';
import WeatherCard from '../components/weather-card/WeatherCard';
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core';
import {
  getStoredCities,
  getStoredOptions,
  ILocalStorageOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';
import { Messages } from '../utils/messages';

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([]);

  const [cityInput, setCityInput] = useState<string>('');
  const [options, setOptions] = useState<ILocalStorageOptions | null>(null);

  useEffect(() => {
    getStoredCities().then(cities => setCities(cities));
    getStoredOptions().then(options => setOptions(options));
  }, []);

  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return;
    }
    const updateCities = [...cities, cityInput];
    setStoredCities(updateCities).then(() => {
      setCities(updateCities);
      setCityInput('');
    });
  };

  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1);
    const updateCities = [...cities];
    setStoredCities(updateCities).then(() => setCities(updateCities));
  };

  const handleTempScaleButtonClick = () => {
    const updateOptions: ILocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    };
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions);
    });
  };

  const handleOverlayButtonClick = () => {
    chrome.tabs.query(
      {
        active: true,
      },
      tabs => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
        }
      },
    );
  };

  if (!options) {
    return null;
  }

  return (
    <Box mx={'8px'} my={'16px'}>
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box
              px={'15px'}
              py={'5px'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={event => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py={'2px'}>
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py={'2px'}>
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          tempScale={options.tempScale}
          key={index}
          onDelete={() => handleCityDeleteButtonClick(index)}
        />
      ))}
      <Box height={'16px'} />
    </Box>
  );
};

const rootDiv = document.createElement('div');
document.body.appendChild(rootDiv);
const root = ReactDOM.createRoot(rootDiv);

root.render(<App />);
