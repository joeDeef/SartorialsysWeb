import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Cart from '../models/Cart.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  }

  // Crear el carrito automáticamente cuando el usuario es creado
  if (this.isNew) {
    const cart = new Cart({
      user: this._id,  // Relacionamos el carrito con el ID del usuario recién creado
      items: [],
      totalPrice: 0
    });

    await cart.save();  // Guardamos el carrito en la base de datos

    // Asignamos el ID del carrito al campo 'cart' del usuario
    this.cart = cart._id;
  }

  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);