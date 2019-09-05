const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-managaer-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// const me = new User({
//   name: "Jitendra",
//   email: "jeetu241295@gmail.com",
//   password: "Ronaldo@7",
//   age: 23
// });
// me.save()
//   .then(result => console.log(result))
//   .catch(error => console.log("error:- " + error.message));

// const task1 = new Task({ description: "Reading", completed: true });

// task1
//   .save()
//   .then(result => console.log(result))
//   .catch(error => console.log(error));
