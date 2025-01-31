const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pricePerUnitSchema = new Schema({
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: [pricePerUnitSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("products", productSchema);
module.exports = Product;
