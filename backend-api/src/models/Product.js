import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String, 
    required: true
  },
  category: { 
    type: String, 
    enum: ['Shirt', 'Accessory', 'Suit', 'Jacket', 'Pants'], 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price must be greater than or equal to 0']
  },
  inventory: [
    {
      size: { 
        type: String, 
        enum: ['S', 'M', 'L', 'XL'],
        required: false
      },
      color: [
        {
          name: { type: String, required: true },
          amount: { 
            type: Number, 
            required: true,
            min: [0, 'Amount must be greater than or equal to 0']
          },
          status: { 
            type: Boolean, 
            enum: [true, false], // Available or Not Available
            default: true 
          }
        }
      ]
    }
  ],
  images: [String]
});

export default mongoose.model("Product", productSchema);