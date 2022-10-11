import { Card } from '@material-ui/core';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import WeatherCard from '../components/weather-card/WeatherCard';
import { Messages } from '../utils/messages';
import { getStoredOptions, ILocalStorageOptions } from '../utils/storage';
// import './contentScript.scss';
import styles from './contentScript.module.scss';

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<ILocalStorageOptions | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    getStoredOptions().then(options => {
      setOptions(options);
      setIsActive(options.hasAutoOverlay);
    });
  }, []);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(msg => {
      if (msg === Messages.TOGGLE_OVERLAY) {
        setIsActive(!isActive);
      }
    });
  }, [isActive]);

  if (!options) {
    return null;
  }
  return (
    <>
      {isActive && (
        <Card className={styles.overlayCard}>
          <WeatherCard
            city={options.homeCity}
            tempScale={options.tempScale}
            onDelete={() => setIsActive(false)}
          />
        </Card>
      )}
    </>
  );
};

const rootDiv = document.createElement('div');
document.body.appendChild(rootDiv);
const root = ReactDOM.createRoot(rootDiv);

root.render(<App />);
