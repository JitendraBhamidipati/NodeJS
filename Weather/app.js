const utils = require("./utils");
const yargs = require("yargs");

const getWeatherForecast = city => {
  utils.getGeoCode(city, (error, res) => {
    if (error) console.log(error);
    if (res)
      console.log(
        res.summary +
          " It is currently " +
          res.cityWeather.temperature +
          " degress out. There is a " +
          res.cityWeather.precipProbability +
          "% chance of rain."
      );
  });
};

yargs.version("1.1.0");

yargs.command({
  command: "search",
  describe: "Getting weather data",
  builder: {
    city: {
      demandOption: true,
      type: "string",
      describe: "Name of the city"
    }
  },
  handler: args => {
    getWeatherForecast(args.city);
  }
});

yargs.parse();
