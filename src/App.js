import { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import { getPlacesData, getWeatherData } from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  useEffect(() => {
    if (bounds.sw && bounds.ne) {
      setLoading(true);
      getWeatherData(coordinates.lat, coordinates.lng).then((data) =>
        setWeatherData(data)
      );
      getPlacesData(type, bounds.ne, bounds.sw).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, bounds]);

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            rating={rating}
            setRating={setRating}
            type={type}
            setType={setType}
            loading={loading}
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};
export default App;
