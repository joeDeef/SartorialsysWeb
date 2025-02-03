import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import express from 'express';

// Configuración para servir la carpeta 'uploads' como pública
const app = express();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

export const addProduct = async (req, res) => {
  try {
    const { code, name, price, category, size, amount, color } = req.body;

    const product = new Product({
      code,
      name,
      price,
      category,
      size,
      amount,
      color,
      status: req.body.status !== undefined ? req.body.status : amount > 0,
      images: []
    });

    const productStored = await Product.create(product);

    if (!productStored) {
      return res.status(404).send({ message: 'The product was not saved' });
    }

    return res.status(201).send({ message: "Product created successfully", product: productStored });
  } catch (error) {
    console.error(error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: `This code already exists: ${req.body.code}`,
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(204).json({ message: "No products found" });
    }

    res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const productCode = req.params.code;
    const fileNames = [];

    if (req.files && req.files.image) {
      const files = req.files.image;

      for (const file of files) {
        const filePath = file.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[fileSplit.length - 1];
        const extSplit = fileName.split('.');
        const fileExt = extSplit[1];

        if (['png', 'jpg', 'jpeg', 'gif', 'PNG'].includes(fileExt)) {
          fileNames.push(fileName);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) console.error(err.message);
          });
        }
      }

      if (fileNames.length > 0) {
        const productUpdated = await Product.findOneAndUpdate(
          { code: productCode },
          { $push: { images: { $each: fileNames } } },
          { new: true }
        );

        if (!productUpdated) {
          return res.status(404).send({ message: 'The product does not exist and images cannot be uploaded' });
        }

        return res.status(200).send({ message: 'Images uploaded successfully', product: productUpdated });
      } else {
        return res.status(200).send({ message: 'No valid images were uploaded' });
      }
    } else {
      return res.status(200).send({ message: 'No images received' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const codeProduct = req.params.code;
    const product = await Product.findOne({ code: codeProduct });

    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

import Cart from '../models/Cart.js';  // Asegúrate de importar el modelo de carrito

export const deleteProduct = async (req, res) => {
  try {
    const codeProduct = req.params.code;
    const productToDelete = await Product.findOne({ code: codeProduct });

    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Eliminar producto de los carritos
    const carts = await Cart.find({ 'items.product': productToDelete._id });

    for (const cart of carts) {
      // Elimina el item del carrito
      cart.items = cart.items.filter(item => item.product.toString() !== productToDelete._id.toString());
      
      // Actualizar el totalPrice del carrito
      await cart.updateTotalPrice();  // Este método actualizará el precio total
    }

    // Eliminar las imágenes asociadas al producto
    const imagesDirectory = path.join(process.cwd(), 'uploads');
    const imageNames = productToDelete.images;

    if (imageNames && imageNames.length > 0) {
      for (const imageName of imageNames) {
        const imagePath = path.join(imagesDirectory, imageName);
        
        try {
          await fs.promises.unlink(imagePath);
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err.message);
        }
      }
    }

    // Eliminar el producto de la base de datos
    await Product.findOneAndDelete({ code: codeProduct });

    res.status(200).json({ message: "Product deleted successfully and removed from all carts" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const codeProduct = String(req.params.code);
    const body = req.body;

    const productUpdated = await Product.findOneAndUpdate(
      { code: codeProduct },
      body,
      { new: true }
    );

    if (!productUpdated) {
      return res.status(404).json({ message: "Product not found" });
    }

    const carts = await Cart.find({ 'items.product': productUpdated._id });

    for (const cart of carts) {
      await cart.updateTotalPrice();
    }

    res.status(200).json({
      message: "Product updated successfully and cart prices updated",
      product: productUpdated,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getImages = async (req, res) => {
  try {
    const productCode = req.params.code;
    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const images = product.images.map(image => `${req.protocol}://${req.get('host')}/uploads/${image}`);

    if (images.length > 0) {
      return res.status(200).json({ images });
    } else {
      return res.status(200).json({ message: 'No images found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { code } = req.params;
    const { imageName } = req.body;

    const product = await Product.findOne({ code });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const imageWithExtension = product.images.find(image => {
      const imageNameWithoutExtension = path.basename(image, path.extname(image));
      return imageNameWithoutExtension === imageName;
    });

    if (!imageWithExtension) {
      return res.status(400).json({ message: 'Image not found in product' });
    }

    const imagesDirectory = path.join(process.cwd(), 'uploads');
    const imagePath = path.join(imagesDirectory, imageWithExtension);

    try {
      await fs.promises.unlink(imagePath);
    } catch (err) {
      console.error(`Failed to delete image: ${imagePath}`, err.message);
      return res.status(500).json({ message: `Failed to delete image: ${err.message}` });
    }

    const imageIndex = product.images.indexOf(imageWithExtension);
    if (imageIndex > -1) {
      product.images.splice(imageIndex, 1);
    }

    await product.save();

    return res.status(200).json({ message: 'Image deleted successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
