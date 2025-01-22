const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Mongo DB Is Connected"))
    .catch((err) => console.log("DB Connection Failed", err));
};

module.exports = { connectDB };

