const mongodb = require("mongodb");
const { MongoClient, ObjectID } = mongodb;

const id = new ObjectID();

let connectionURL = "mongodb://127.0.0.1:27017";
let databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) return console.log("Unable to connect to the Database");
    const db = client.db(databaseName);
    // db.collection("users").insertOne(
    //   {
    //     name: "Jitendra",
    //     age: 23
    //   },
    //   (error, result) => {
    //     if (error) return console.log("Unable to insert user");
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Luffy",
    //       age: 20
    //     },
    //     {
    //       name: "zoro",
    //       age: 19
    //     },
    //     { name: "sanji", age: 19 }
    //   ],
    //   (error, result) => {
    //     if (error) return console.log("Unable to insert documents");
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("tasks").insertMany(
    //   [
    //     { description: "Dinking", completed: true },
    //     { description: "Reading", completed: false },
    //     { description: "Playing", completed: true }
    //   ],
    //   (error, result) => {
    //     if (error) return console.log("Unable to insert documents");
    //     console.log(result.ops);
    //   }
    // );

    // db.collection("users").findOne({ name: "Luffy" }, (error, result) => {
    //   if (error) return console.log("Unable to fetch document");
    //   console.log(result);
    // });

    // db.collection("users")
    //   .find({ age: 19 })
    //   .toArray((error, result) => {
    //     console.log(result);
    //   });

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("5d5ebab030ffd0329854d6e3") },
    //   (error, result) => {
    //     if (error) return console.log("Unable to fetch Data");
    //     console.log(result);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ completed: false })
    //   .toArray((error, result) => {
    //     if (error) return console.log("Unable to fetch data");
    //     console.log(result);
    //   });

    // db.collection("users")
    //   .deleteOne({ name: "sanji" })
    //   .then(res => console.log(res.deletedCount))
    //   .catch(console.log("Unable to delete"));

    // db.collection("tasks")
    //   .deleteMany({ completed: true })
    //   .then(res => console.log(res))
    //   .catch(error => console.log(error));

    // db.collection("users")
    //   .updateOne({ name: "sanji" }, { $set: { name: "Sanji" } })
    //   .then(res => console.log(res))
    //   .catch(error => console.log(error));

    // db.collection("tasks")
    //   .updateMany({ completed: true }, { $set: { completed: false } })
    //   .then(res => console.log(res))
    //   .catch(error => console.log(error));
  }
);
