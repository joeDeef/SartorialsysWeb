import * as orderService from "../services/orderService.js";
import {
  logsError,
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/messages.js";
import {
  CartNotFoundError,
  SizeNotFoundError,
  ColorNotFoundError,
} from "../errors/cartErrors.js";


export const saveOrder = async (req, res) => {
  try {
    const order = await orderService.saveOrder(
      req.params.cartId,
      req.body.shippingInfo,
      req.body.paymentInfo
    );

    if (!order) throw Error("Errror to create order");
    sendSuccessResponse(res, "Order placed successfully", order, 201);
  } catch (error) {
    const handledErrors = [
      CartNotFoundError,
      SizeNotFoundError,
      ColorNotFoundError
    ];

    if (handledErrors.some((err) => error instanceof err)) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
    logsError(error);
    sendErrorResponse(res);
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.params.userId);

    if (!orders || orders.length === 0) {
      return sendErrorResponse(res, "No orders found", 204);
    }
    sendSuccessResponse(res, "Orders retrieved successfully", orders);
  } catch (error) {
    logsError(error);
    sendErrorResponse(res);
  }
};
