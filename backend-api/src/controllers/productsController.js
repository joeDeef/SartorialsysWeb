import Product from "../models/Product.js";
import uploadProductImages from "../utils/uploadImages.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/messages.js";

export const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = new Product({
      ...productData,
      images: [],
    });

    const productStored = await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: productStored,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      sendErrorResponse(
        res,
        error.message,
        `This code already exists: ${productData.code}`,
        409
      );
    }
    sendErrorResponse(res, error.message);
  }
};

export const uploadImages = async (req, res) => {
  try {
    const { code } = req.params;
    let fileNames = [];

    try {
      fileNames = await uploadProductImages(req.files, "products");
    } catch (error) {
      return sendErrorResponse(res, error.message);
    }

    const productFound = await Product.findOneAndUpdate(
      { code },
      { $push: { images: { $each: fileNames } } },
      { new: true }
    );

    if (!productFound) {
      return sendErrorResponse(res, "", "Product not found", 404);
    }

    return sendSuccessResponse(res, "Images added", productFound, 200);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const { filter, pagination, sort } = req.queryParams;

    const products = await Product.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort);

    if (!products || products.length === 0) {
      return sendErrorResponse(res, "", "No products found", 204);
    }

    sendSuccessResponse(res, "Products retrieved successfully", products);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, error.message);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { code: codeProduct } = req.params;
    const product = await Product.findOne({
      code: codeProduct,
      available: true,
      deleted: false,
    });

    if (!product) {
      return sendErrorResponse(res, "", "No product found", 404);
    }
    sendSuccessResponse(res, "Product retrieved successfully", product);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productData = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { code: req.params.code },
      {
        ...productData,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return sendErrorResponse(res, "", "Product not found", 404);
    }

    sendSuccessResponse(
      res,
      "Product updated successfully",
      updatedProduct,
      200
    );
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

export const updatePartialProduct = async (req, res) => {
  try {
    const { code } = req.params;
    const productData = req.body;

    const update = {};
    Object.keys(productData).forEach((key) => {
      if (key !== "inventory") {
        update[key] = productData[key];
      }
    });

    let updatedProduct = null;

    if (productData.inventory) {
      for (const sizeData of productData.inventory) {
        for (const colorData of sizeData.colors) {
          updatedProduct = await Product.findOneAndUpdate(
            {
              code,
              "inventory.size": sizeData.size,
              "inventory.colors.name": colorData.name,
            },
            {
              $set: {
                "inventory.$[size].colors.$[color].amount": colorData.amount,
                "inventory.$[size].colors.$[color].available": colorData.available,
                ...update,
              },
            },
            {
              new: true,
              arrayFilters: [
                { "size.size": sizeData.size },
                { "color.name": colorData.name },
              ],
            }
          );
        }
      }
    } else {
      updatedProduct = await Product.findOneAndUpdate({ code }, { $set: update }, { new: true });
    }

    if (!updatedProduct) {
      return sendErrorResponse(res, "", "Product not found", 404);
    }

    sendSuccessResponse(res, "Product updated successfully", updatedProduct, 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { code } = req.params;
    const productToDelete = await Product.findOneAndUpdate(
      { code },
      { deleted: true }
    );
    if (!productToDelete) {
      return sendErrorResponse(res, "", "Product not found", 404);
    }
    sendSuccessResponse(res, "Product deleted successfully");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { code } = req.params;
    const { imageName } = req.body;

    const product = await Product.findOne({ code });

    if (!product) {
      sendErrorResponse(res, "", "Product not found", 404);
    }

    const imageIndex = product.images.indexOf(imageName);
    if (imageIndex > -1) {
      product.images.splice(imageIndex, 1);
    }

    await product.save();

    sendSuccessResponse(res, "Image deleted successfully", product, 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const addSize = async (req, res) => {
  const { code } = req.params;
  const { size, colors } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { code },
      {
        $push: {
          inventory: {
            size,
            colors,
            available: true,
          },
        },
      },
      { new: true }
    );

    if (!updatedProduct)
      return sendErrorResponse(res, "", "Product not found", 404);
    sendSuccessResponse(res, "Size added to inventory", updatedProduct);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const addColor = async (req, res) => {
  try {
    const { code, size } = req.params;
    const { colors } = req.body;

    // Buscar el producto y la talla dentro del inventario
    const updatedProduct = await Product.findOneAndUpdate(
      {
        code,
        "inventory.size": size,
      },
      {
        $push: {
          "inventory.$.colors": { $each: colors },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return sendErrorResponse(res, "", "Product or size not found", 404);
    }

    sendSuccessResponse(res, "Colors added to the size", updatedProduct, 200);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const removeSize = async (req, res) => {
  try {
    const { code, size } = req.params;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        code,
      },
      {
        $pull: {
          inventory: { size },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return sendErrorResponse(res, "", "Product or size not found", 404);
    }

    sendSuccessResponse(
      res,
      "Size removed from the product",
      updatedProduct,
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const removeColor = async (req, res) => {
  try {
    const { code, size, color } = req.params;

    const updatedProduct = await Product.findOneAndUpdate(
      { code, "inventory.size": size },
      {
        $pull: {
          "inventory.$.colors": { name: color },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return sendErrorResponse(
        res,
        "",
        "Product, size, or color not found",
        404
      );
    }

    sendSuccessResponse(
      res,
      "Color removed from the product",
      updatedProduct,
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};
