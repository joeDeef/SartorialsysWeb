import * as cartService from "../services/cartService.js";
import {
  logsError,
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/messages.js";

export const addProductToCart = async (req, res) => {
  try {
    const updatedCart = await cartService.addProductToCart(
      req.params.cartId,
      req.body.productCode,
      req.body.size,
      req.body.color,
      req.body.quantity
    );

    if (!updatedCart) return sendErrorResponse(res, "Cart not found", 404);
    sendSuccessResponse(
      res,
      "Product added to cart and inventory updated",
      updatedCart
    );
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.params.cartId);

    if (!cart) return sendErrorResponse(res, "Cart not found", 404);
    sendSuccessResponse(res, "Cart found", cart);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const updatedCart = await cartService.updateProductQuantity(
      req.params.cartId,
      req.body.productCode,
      req.body.size,
      req.body.color,
      req.body.newQuantity
    );

    if (!updatedCart) return sendErrorResponse(res, "Cart not found", 404);
    sendSuccessResponse(
      res,
      "Product quantity updated successfully",
      updatedCart
    );
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const updatedCart = await cartService.deleteProductFromCart(
      req.params.cartId,
      req.body.productCode,
      req.body.size,
      req.body.color
    );
    if (!updatedCart) return sendErrorResponse(res, "Cart not found", 404);
    sendSuccessResponse(
      res,
      "Product removed from cart and stock updated",
      updatedCart
    );
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};
