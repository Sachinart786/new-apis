const Product = require("../models/product");
const { isEmpty, get } = require("lodash");

const handleBill = async (req, res) => {
  const { request } = req.body;

  if (isEmpty(request) || !Array.isArray(request)) {
    return res.status(400).send({
      message: "Invalid input: 'request' array is required.",
      success: false,
    });
  }

  try {
    let totalAmount = 0;
    let totalQuantity = 0;
    const items = [];

    for (const item of request) {
      const { name, quantity, unit } = item;
      if (!name || !quantity || quantity <= 0 || !unit) {
        return res.status(400).send({
          message: `Invalid item: ${name}. All fields (name, quantity, unit) are required.`,
          success: false,
        });
      }

      const product = await Product.findOne({ name });
      if (isEmpty(product)) {
        return res.status(404).send({
          message: `Product not found: ${name}`,
          success: false,
        });
      }

      const selectedUnit = get(product, "pricePerUnit", []).find(
        (e) => e.unit === unit
      );

      const itemTotal = selectedUnit.price * quantity;
      totalAmount += itemTotal;
      totalQuantity += quantity;

      items.push({
        name,
        quantity,
        unit,
        pricePerUnit: selectedUnit.price,
        itemTotal,
      });
    }

    res.send({
      items,
      totalQuantity,
      totalAmount,
      success: true,
    });
  } catch (error) {
    console.error("Error in handleBill:", error);
    res.status(500).send({ message: "Internal server error.", success: false });
  }
};

module.exports = { handleBill };
