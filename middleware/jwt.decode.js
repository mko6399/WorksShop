const jwt = require("jsonwebtoken");
const userSchema = require("../models/users.model.js");
const e = require("express");

module.exports = async function (req, res, next) {
  var token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({ message: "Unauthorized", error: err });
      }

      if (!req.params) {
        const user = await userSchema.findOne({ name: decoded.name });

        if (user.isApproved === false) {
          return res.status(403).json({ message: "User not approved" });
        }
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
