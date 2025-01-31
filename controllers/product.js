const Product = require("../models/product");

const handleAddProducts = async (req, res) => {
  try {
    const { name, pricePerUnit } = req.body;

    if (!name || !pricePerUnit || !Array.isArray(pricePerUnit)) {
      return res.status(400).send({
        message: "Invalid input: name and pricePerUnit (array) are required.",
        success: false,
      });
    }
    const product = await Product.findOne({
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

const handleGetProducts = async (req, res) => {
  try {
    const tasks = await Product.find({});
    res.status(200).send({ data: tasks, success: true });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const handleUpdateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pricePerUnit } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ message: "Product ID is required.", success: false });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ message: "Invalid product ID format.", success: false });
    }

    if (!name && !pricePerUnit) {
      return res.status(400).send({
        message:
          "At least one field (name or pricePerUnit) must be provided for update.",
        success: false,
      });
    }

    if (pricePerUnit && !Array.isArray(pricePerUnit)) {
      return res.status(400).send({
        message: "pricePerUnit must be an array.",
        success: false,
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (pricePerUnit) updateFields.pricePerUnit = pricePerUnit;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).send({
        message: "Product not found.",
        success: false,
      });
    }

    res.status(200).send({
      message: "Product Updated Successfully",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error in handleUpdateProduct:", error);
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: error.message,
        success: false,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).send({
        message: "Invalid product ID format.",
        success: false,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const handleDeleteTasks = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid task ID");
  }
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send("Task not found");
    }

    res
      .sendStatus(204)
      .send({ data: result, message: "Deleted Successfully", success: true });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  handleAddProducts,
  handleGetProducts,
  handleUpdateProducts,
  handleDeleteTasks,
};
