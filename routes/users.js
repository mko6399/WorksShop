var express = require("express");
var router = express.Router();
var orderSchema = require("../models/orders.model.js");
var userSchema = require("../models/users.model.js");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userSchema({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", status: 500 });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { name, password } = req.body;

    const user = await userSchema.findOne();

    if (user.name !== name) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Password is incorrect", status: 404 });
    }
    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Login successful",
      status: 200,
      isApproved: user.isApproved,
      token: token,
      id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", status: 500 });
    console.log(error);
  }
});

router.put("/:id/approve", async function (req, res, next) {
  try {
    const { id } = req.params;

    const user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }
    user.isApproved = true;
    await user.save();
    res
      .status(200)
      .json({ message: "User approved successfully", status: 200 });
  } catch (error) {
    res.status(500).json({ message: "Error approving user", status: 500 });
    console.log(error);
  }
});

module.exports = router;
