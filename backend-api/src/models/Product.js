import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String, 
    required: true },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price must be greater than or equal to 0']},
  category: { 
    type: String, 
    enum : ['Camisa','Accesorio','Terno', 'Chaqueta','Pantalón'] , 
    required: true },
  size: { 
    type: String, 
    enum: ['S','M','L','XL'],
    required: function() { return this.category !== 'Accesorio'; },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Price must be greater than or equal to 0']},
    default: 0},
  status: { 
    type: Boolean,
    enum: [true, false], // Disponible o Agotado
    },
  color: { 
    type: String, 
    required: true },
  images: [String]
});

export default mongoose.model("Product", userSchema);