import * as productService from "../services/productService.js";
import {
  logsError,
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/messages.js";

export const addProduct = async (req, res) => {
  try {
    const productStored = await productService.createProduct(req.body);
    sendSuccessResponse(
      res,
      "Product created successfully",
      productStored,
      201
    );
  } catch (error) {
    logsError(error);

    if (error.code === 11000) {
      return sendErrorResponse(
        res,
        `This code already exists: ${productData.code}`,
        409
      );
    }
    sendErrorResponse(res);
  }
};

export const uploadImages = async (req, res) => {
  try {
    const productUpdated = await productService.uploadImagesService(
      req.params.code,
      req.files
    );
    if (!productUpdated)
      return sendErrorResponse(res, "Product not Found", 404);
    sendSuccessResponse(res, "Images added", productUpdated);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.queryParams);
    if (!products || products.length === 0) {
      return sendErrorResponse(res, "No products found", 204);
    }

    sendSuccessResponse(res, "Products retrieved successfully", products);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductByCode(req.params.code);
    if (!product) return sendErrorResponse(res, "Product not Found", 404);
    sendSuccessResponse(res, "Product retrieved successfully", product);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.code,
      req.body
    );

    if (!updatedProduct)
      return sendErrorResponse(res, "Product not Found", 404);
    sendSuccessResponse(
      res,
      "Product updated successfully",
      updatedProduct,
      200
    );
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const updatePartialProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updatePartialProductByCode(
      req.params.code,
      req.body
    );

    if (!updatedProduct)
      return sendErrorResponse(res, "Product not Found", 404);
    sendSuccessResponse(
      res,
      "Product updated successfully",
      updatedProduct,
      200
    );
  } catch (error) {
    logsError(error);
    sendErrorResponse(res, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productToDelete = await productService.deleteProduct(req.params.code);

    if (!productToDelete)
      return sendErrorResponse(res, "Product not Found", 404);
    sendSuccessResponse(res, "Product deleted successfully");
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const deleteImage = async (req, res) => {
  try {
    const updatedProduct = await productService.removeProductImage(
      req.params.code,
      req.body.imageName
    );

    if (!updatedProduct)
      return sendErrorResponse(res, "Product not found", 404);
    sendSuccessResponse(res, "Image deleted successfully", updatedProduct, 200);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const addSize = async (req, res) => {
  try {
    const updatedProduct = await productService.addProductSize(
      req.params.code,
      req.body.size,
      req.body.colors
    );
    if (!updatedProduct)
      return sendErrorResponse(res, "Product not found", 404);
    sendSuccessResponse(res, "Size added to inventory", updatedProduct);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const addColor = async (req, res) => {
  try {
    const updatedProduct = await productService.addProductColor(
      req.params.code,
      req.params.size,
      req.body.colors
    );
    if (!updatedProduct) {
      return sendErrorResponse(res, "Product or size not found", 404);
    }
    sendSuccessResponse(res, "Colors added to the size", updatedProduct, 200);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const removeSize = async (req, res) => {
  try {
    const updatedProduct = await productService.removeProductSize(
      req.params.code,
      req.params.size
    );

    if (!updatedProduct) {
      return sendErrorResponse(res, "Product or size not found", 404);
    }
    sendSuccessResponse(res, "Size removed from the product", updatedProduct);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const removeColor = async (req, res) => {
  try {
    const updatedProduct = await productService.removeProductColor(
      req.params.code,
      req.params.size,
      req.params.color
    );
    if (!updatedProduct) {
      return sendErrorResponse(res, "Product, size, or color not found", 404);
    }
    sendSuccessResponse(res, "Color removed from the product", updatedProduct);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};
