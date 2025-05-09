const mongoose = require("mongoose");
const { Schema } = mongoose;

const oderSchema = new Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", oderSchema);
