let env = process.argv[2] ? process.argv[2] : "dev";

require("dotenv").config({
  path: `./config/${env}.env`
});

const express = require("express");
require("./db/mongoose");

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
// const port = process.env.PORT;

//Uncomment it while server is under maintainece

// app.use((req, res, next) => {
//   res.status(503).send("Application is under maintainence try after some time");
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(taskRouter);

// app.listen(port, () => {
//     console.log("App is  running in port " + port);
//   });
module.exports = app;
