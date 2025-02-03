import mongoose from 'mongoose';
import Cart from './Cart.js';

const orderItemSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    unitPrice: {
      type: Number,
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
    },
    totalPrice: {
      type: Number,
      required: true
    }
  });
  

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado', 'Devuelto'],
        default: 'Pendiente', // El estado predeterminado es 'Pendiente'
      },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shippingInfo: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String
  },
  paymentInfo: {
    cardName: String,
    cardNumber: String,
    expirationDate: String,
    cvv: String
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Total price must be greater than or equal to 0']
  },
  orderTotalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be greater than or equal to 0']
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
