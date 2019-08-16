const express = require("express");
const utils = require("./utils");

const app = express();

app.get("", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide the address"
    });
  }
  utils.getGeoWeather(req.query.address, (error, data) => {
    if (error) console.log(error);
    if (data)
      res.send({
        forecast:
          data.summary +
          " It is currently " +
          data.cityWeather.temperature +
          " degress out. There is a " +
          data.cityWeather.precipProbability +
          "% chance of rain.",
        address: req.query.address,
        location: data.locationData.location
      });
  });
});

app.get("/contact", (req, res) => {
  res.send("Contact Page");
});

app.listen("3000");
