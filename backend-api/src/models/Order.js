import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be greater than or equal to 1"],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "Pendiente",
      "En proceso",
      "Enviado",
      "Entregado",
      "Cancelado",
      "Devuelto",
    ],
    default: "Pendiente",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shippingInfo: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentInfo: {
    cardName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, "Subtotal must be greater than or equal to 0"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
