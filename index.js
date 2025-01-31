const { json } = require("express");
const express = require("express");
const cors = require("cors");

require("dotenv").config();


const productRouter  = require("./routes/product");
const loginRouter  = require("./routes/auth");
const billRouter  = require("./routes/sell");
const stockRouter  = require("./routes/stock");
const {connectDB}  = require("./config");

connectDB(process.env.MONGODB_URI);
const app = express();

app.use(json());
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/v1/bill", billRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/", loginRouter);

app.listen(9090, () => {
  console.log("Sever Is Running On Port 9090");
});
