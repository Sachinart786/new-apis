const { json } = require("express");
const express = require("express");
const cors = require("cors");

const corsConfing = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
}

require("dotenv").config();

const port = process.env.PORT || 8000;

const productRouter = require("./routes/product");
const loginRouter = require("./routes/auth");
const billRouter = require("./routes/sell");
const stockRouter = require("./routes/stock");
const { connectDB } = require("./config");

connectDB(process.env.MONGODB_URI);
const app = express();

app.options("", cors(corsConfing));

app.use(json());
app.use(cors(corsConfing));
app.use(express.json());

// Routes

app.use("/api/v1/bill", billRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/auth", loginRouter);

app.listen(port, () => {
  console.log(`Sever Is Running On Port ${port}`);
});
