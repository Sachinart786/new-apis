const Stock = require("../models/stock");
const handleAddStocks = async (req, res) => {
  try {
    const { name, pricePerUnit } = req.body;

    if (!name || !pricePerUnit || !Array.isArray(pricePerUnit)) {
      return res.status(400).send({
        message: "Invalid input: name and pricePerUnit (array) are required.",
        success: false,
      });
    }
    const product = await Stock.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (product) {
      return res.status(409).send({
        message: "Product already exist.",
        success: false,
      });
    } else {
      const payload = { name, pricePerUnit };
      const newProduct = new Product(payload);
      await newProduct.save();

      res
        .status(201)
        .send({ message: "Product added successfully", success: true });
    }
  } catch (error) {
    console.error("Error in handleAddProducts:", error);
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

module.exports = { handleAddStocks };
