var mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: { type: String },
    productStock: { type: Number },
    productPrice: { type: Number },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
