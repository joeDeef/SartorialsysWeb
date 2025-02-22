import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Cart from "../models/Cart.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  active: { type: Boolean, default: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
});

// Encrypt password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Create a cart automatically when a new user is created
  if (this.isNew) {
    const cart = new Cart({
      user: this._id, // Relating the cart to the newly created user ID
      items: [],
      totalPrice: 0,
    });

    await cart.save(); // Save the cart to the database

    // Assign the cart ID to the 'cart' field of the user
    this.cart = cart._id;
  }

  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
