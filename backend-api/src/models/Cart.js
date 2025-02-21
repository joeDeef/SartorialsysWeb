import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Esquema de ítem en el carrito (solo código de producto y cantidad)
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be greater than or equal to 1']
  }
});

// Esquema del carrito
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be greater than or equal to 0'],
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

// Método para actualizar el totalPrice del carrito
cartSchema.methods.updateTotalPrice = async function () {
  let total = 0;

  // Recorremos todos los items del carrito
  for (const item of this.items) {
    const product = await Product.findById(item.product).exec();
    
    if (product) {
      // Verificamos si el producto tiene la talla y el color correctos
      const sizeData = product.inventory.find(s => s.size === item.size);
      if (sizeData) {
        const colorData = sizeData.colors.find(c => c.name === item.color);
        if (colorData) {
          total += item.quantity * product.price;
        }
      }
    }
  }

  this.totalPrice = total;
  await this.save();
};

export default mongoose.model('Cart', cartSchema);