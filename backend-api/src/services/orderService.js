import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

/**
 * Creates a new order from a cart and clears the cart after saving the order.
 * @param {string} cartId - ID of the cart.
 * @param {Object} shippingInfo - Shipping details.
 * @param {Object} paymentInfo - Payment details.
 * @returns {Promise<Object>} - Created order.
 */
export const saveOrder = async (cartId, shippingInfo, paymentInfo) => {
  const cart = await Cart.findById(cartId).populate("items.product");
  if (!cart) throw new Error("Cart not found");

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product) continue;

    const sizeData = product.inventory.find((s) => s.size === item.size);
    if (!sizeData)
      throw new Error(
        `Size ${item.size} not found for product ${product.name}`
      );

    const colorData = sizeData.colors.find((c) => c.name === item.color);
    if (!colorData)
      throw new Error(
        `Color ${item.color} not found for product ${product.name}`
      );

    const totalPrice = item.quantity * product.price;
    orderItems.push({
      productId: product._id,
      code: product.code,
      name: product.name,
      unitPrice: product.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      totalPrice,
    });

    subtotal += totalPrice;
  }

  const order = new Order({
    user: cart.user,
    shippingInfo,
    paymentInfo,
    items: orderItems,
    subtotal,
    orderDate: new Date(),
    status: "Pendiente",
  });

  await order.save();

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return order;
};

/**
 * Fetches all orders for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - List of orders.
 */
export const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ user: userId });
  return orders;
};
