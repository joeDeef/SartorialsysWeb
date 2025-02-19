import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import Cart from "../models/Cart.js";
import uploadImage from "../utils/uploadImage.js";

const sendErrorResponse = (res, message, statusCode = 500) => {
  console.error(message);
  res.status(statusCode).json({ message });
};

const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({ message, data });
};

export const addProduct = async (req, res) => {
  try {
    const product = req.body;
    const productStored = await Product.create(product);

    if (!productStored) {
      return sendErrorResponse(res, "The product was not saved", 404);
    }

    return sendSuccessResponse(
      res,
      "Product created successfully",
      productStored,
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return sendErrorResponse(
        res,
        `This code already exists: ${req.body.code}`,
        409
      );
    }
    sendErrorResponse(res, "Internal server error");
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return sendErrorResponse(res, "No products found", 204);
    }
    sendSuccessResponse(res, "Products retrieved successfully", products);
  } catch (error) {
    sendErrorResponse(res, "Internal server error");
  }
};

export const uploadImages = async (req, res) => {
  try {
    const { code: productCode } = req.params;
    const files = req.files;

    if (!files || !files.image || files.image.length === 0) {
      return res.status(400).json({ message: "No images received" });
    }

    const fileNames = [];

    // Procesar cada archivo recibido
    for (const image of files.image) {
      const filePath = image.path;

      const pathFile = path.join(path.resolve(""), filePath);

      try {
        const imageUrl = await uploadImage(`${pathFile}`, "products");
        fileNames.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res
          .status(500)
          .json({ message: "Error uploading image to Cloudinary" });
      }

      fs.unlinkSync(filePath);
    }

    if (fileNames.length > 0) {
      const productUpdated = await Product.findOneAndUpdate(
        { code: productCode },
        { $push: { images: { $each: fileNames } } },
        { new: true }
      );

      if (!productUpdated) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res
        .status(200)
        .json({
          message: "Images uploaded successfully",
          product: productUpdated,
        });
    } else {
      return res.status(400).json({ message: "No valid images uploaded" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { code: codeProduct } = req.params;
    const product = await Product.findOne({ code: codeProduct });

    if (!product) {
      return sendErrorResponse(res, "No product found", 404);
    }

    sendSuccessResponse(res, "Product retrieved successfully", product);
  } catch (error) {
    sendErrorResponse(res, "Internal server error");
  }
};

//OBSERVACION
export const deleteProduct = async (req, res) => {
  try {
    const { code: codeProduct } = req.params;
    const productToDelete = await Product.findOne({ code: codeProduct });

    if (!productToDelete) {
      return sendErrorResponse(res, "Product not found", 404);
    }

    const carts = await Cart.find({ "items.product": productToDelete._id });

    for (const cart of carts) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productToDelete._id.toString()
      );
      await cart.updateTotalPrice();
    }

    // Eliminar imágenes asociadas
    const imagesDirectory = path.join(process.cwd(), "uploads");
    const imageNames = productToDelete.images;

    if (imageNames.length > 0) {
      for (const imageName of imageNames) {
        const imagePath = path.join(imagesDirectory, imageName);
        try {
          await fs.promises.unlink(imagePath);
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err.message);
        }
      }
    }

    await Product.findOneAndDelete({ code: codeProduct });
    sendSuccessResponse(
      res,
      "Product deleted successfully and removed from all carts"
    );
  } catch (error) {
    sendErrorResponse(res, "Internal server error");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { code } = req.params; // El código del producto es pasado en la URL
    const updateFields = req.body; // Campos a actualizar

    // Buscamos el producto por el código
    const product = await Product.findOne({ code });

    if (!product) {
      return sendErrorResponse(res, "Product not found", 404);
    }

    // Actualizamos los campos solo si están presentes en el cuerpo de la solicitud
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] !== undefined) {
        product[key] = updateFields[key];
      }
    });

    // Si el campo 'inventory' es actualizado, validamos que la estructura sea correcta
    if (updateFields.inventory) {
      updateFields.inventory.forEach((updatedInventory) => {
        const { size, color } = updatedInventory;

        const inventoryItem = product.inventory.find(
          (item) => item.size === size
        );

        if (inventoryItem) {
          color.forEach((updatedColor) => {
            const colorItem = inventoryItem.color.find(
              (c) => c.name === updatedColor.name
            );

            if (colorItem) {
              if (updatedColor.amount !== undefined) {
                colorItem.amount = updatedColor.amount;
              }

              if (updatedColor.status !== undefined) {
                colorItem.status = updatedColor.status;
              }
            } else {
              inventoryItem.color.push(updatedColor);
            }
          });
        } else {
          product.inventory.push(updatedInventory);
        }
      });
    }

    // Guardamos el producto actualizado
    const updatedProduct = await product.save();

    return sendSuccessResponse(
      res,
      "Product updated successfully",
      updatedProduct,
      200
    );
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Internal server error", 500);
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { code } = req.params;
    const { imageName } = req.body;

    const product = await Product.findOne({ code });

    if (!product) {
      return sendErrorResponse(res, "Product not found", 404);
    }

    const imageWithExtension = product.images.find((image) => {
      const imageNameWithoutExtension = path.basename(
        image,
        path.extname(image)
      );
      return imageNameWithoutExtension === imageName;
    });

    if (!imageWithExtension) {
      return sendErrorResponse(res, "Image not found in product", 400);
    }

    const imagesDirectory = path.join(process.cwd(), "uploads");
    const imagePath = path.join(imagesDirectory, imageWithExtension);

    try {
      await fs.promises.unlink(imagePath);
    } catch (err) {
      return sendErrorResponse(res, `Failed to delete image: ${err.message}`);
    }

    product.images = product.images.filter(
      (image) => image !== imageWithExtension
    );
    await product.save();

    sendSuccessResponse(res, "Image deleted successfully", product);
  } catch (error) {
    sendErrorResponse(res, "Internal server error");
  }
};
