import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Shirt", "Accessory", "Suit", "Jacket", "Pants"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be greater than or equal to 0"],
  },
  inventory: [
    {
      size: {
        type: String,
        enum: ["S", "M", "L", "XL"],
        required: false,
      },
      colors: [
        {
          name: { type: String, required: true },
          amount: {
            type: Number,
            required: true,
            min: [0, "Amount must be greater than or equal to 0"],
          },
          available: {
            type: Boolean,
            default: true,
          },
        },
      ],
      available: {
        type: Boolean,
        default: true,
      },
    },
  ],
  available: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  images: [String],
});

// Middleware to update `available` after to save
productSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  let productUpdated = false;

  doc.inventory.forEach((size) => {
    size.colors.forEach((color) => {
      const newAvailability = color.amount > 0;
      if (color.available !== newAvailability) {
        color.available = newAvailability;
        productUpdated = true;
      }
    });

    const sizeAvailable = size.colors.some((color) => color.available);
    if (size.available !== sizeAvailable) {
      size.available = sizeAvailable;
      productUpdated = true;
    }
  });

  const productAvailable = doc.inventory.some((size) => size.available);
  if (doc.available !== productAvailable) {
    doc.available = productAvailable;
    productUpdated = true;
  }

  if (productUpdated) {
    await doc.save();
  }
});

export default mongoose.model("Product", productSchema);
