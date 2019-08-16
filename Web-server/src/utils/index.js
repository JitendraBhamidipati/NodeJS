const request = require("request");

const getGeoCode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1Ijoiaml0ZW5kcmEyNCIsImEiOiJjanozdGg4a2owNm1qM2lueTUza2l0ZGJ2In0._nRv_qknzC-jPLZ14wFfgg`;
  request({ url: url, json: true }, (error, response) => {
    if (error) callback("Unable to access the geo-location API");
    else if (response.body.features.length === 0)
      callback("The given location doesn't exist. Try anotherlocation");
    else {
      const latitude = response.body.features[0].center[1];
      const longitude = response.body.features[0].center[0];
      const location = response.body.features[0].place_name;
      getWeatherData(
        {
          latitude,
          longitude,
          location
        },
        callback
      );
    }
  });
};

const getWeatherData = (data, callback) => {
  const url = `https://api.darksky.net/forecast/3a958c5ed582ef5b70ec55d31374cd74/${
    data.latitude
  },${data.longitude}?units=si&lang=en`;
  request({ url: url, json: true }, (error, response) => {
    if (error) callback("Unable to access the weather API");
    else if (response.code === 400) callback(response.error);
    else
      callback(undefined, {
        locationData: data,
        summary: response.body.daily.data[0].summary,
        cityWeather: response.body.currently
      });
  });
};

const getGeoWeather = (address, callback) => getGeoCode(address, callback);

module.exports = { getGeoWeather };
