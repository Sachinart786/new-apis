const mongoose = require("mongoose");
const { MongoClient, GridFSBucket } = require("mongodb");

const connectDB = async (url) => {
  // return mongoose
  //   .connect(url, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  //   .then(() => console.log("Mongo DB Is Connected"))
  //   .catch((err) => console.log("DB Connection Failed", err));
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db();
};

module.exports = { connectDB };

// async function connectDB(uri) {
//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   await client.connect();
//   return client.db();
// }
