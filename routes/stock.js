var express = require("express");
var router = express.Router();
var orderSchema = require("../models/orders.model.js");
var productSchema = require("../models/products.model.js");
var mongoose = require("mongoose");

router.get("/order", async function (req, res, next) {
  try {
    data = await orderSchema.find({});

    res.status(200).json({ message: "Orders fetched successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error is" + error, status: 500 });
  }
});

router.get("/product", async function (req, res, next) {
  try {
    data = await productSchema.find({});

    res.status(200).json({ message: "product fetched successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error is" + error, status: 500 });
  }
});

router.post("/product", async function (req, res, next) {
  try {
    const { productName, productStock, productPrice } = req.body;
    const product = new productSchema({
      productName: productName,
      productStock: productStock,
      productPrice: productPrice,
    });

    await product.save();
    res.status(201).json({ message: "Insert Successfully", product: product });
  } catch (error) {
    res.send(error);
  }
});

router.put("/product/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let { productName, productStock, productPrice } = req.body;
    let product = await productSchema.findByIdAndUpdate(
      id,
      {
        productName: productName,
        productStock: productStock,
        productPrice: productPrice,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Update Successfully", product: product });
  } catch (error) {
    res.send(error);
  }
});

router.delete("/product/:id", async function (req, res, next) {
  const id = req.params.id;

  try {
    const product = await productSchema.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    res.send(error);
  }
});

router.get("/product/:id", async function (req, res, next) {
  try {
    let id = req.params.id;

    let product = await productSchema.findOne({ _id: id });
    console.log(product);

    res.status(200).json({ message: `Get From Id = ${id}`, product });
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id/order", async function (req, res, next) {
  const id = req.params.id;
  try {
    data = await productSchema.findById(id).populate("orders");

    res.status(200).json({ message: "Find order in product", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error is" + error, status: 500 });
  }
});

router.post("/:id/order", async function (req, res, next) {
  const id = req.params.id;
  const { quantity } = req.body;
  try {
    const countOrderOld = await productSchema.findById(id).populate("orders");
    let countStock = countOrderOld.productStock;
    let countOrder = countOrderOld.orders;
    let totalQuantity = countOrder.reduce(
      (total, order) => total + order.quantity,
      0
    );

    let remaining = countStock - totalQuantity;

    if (quantity > remaining) {
      return res.status(409).json({
        message:
          "Unable to increase order because it exceeds the stock available",
        latestStock: remaining,
      });
    }

    let pushDataPro = await productSchema.findById(id);
    const data = await new orderSchema({
      product: new mongoose.Types.ObjectId(id),
      quantity: quantity,
    });

    await data.save();
    pushDataPro.orders.push(data);
    await pushDataPro.save();
    res.status(200).json({ message: "Seve order in product", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error is" + error, status: 500 });
  }
});

module.exports = router;
