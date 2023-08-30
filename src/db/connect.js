const mongoose = require("mongoose");

// creating database
mongoose
  .connect("mongodb://127.0.0.1:27017/crypto-project", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((e) => {
    console.log(e);
  });
