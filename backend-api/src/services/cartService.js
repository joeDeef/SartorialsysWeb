import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/**
 * Adds a product to the cart and updates inventory.
 * @param {string} cartId - ID of the cart.
 * @param {string} productCode - Code of the product.
 * @param {string} size - Size of the product.
 * @param {string} color - Color of the product.
 * @param {number} quantity - Quantity to add.
 * @returns {Promise<Object|null>} - Updated cart or null if not found.
 */
export const addProductToCart = async (
  cartId,
  productCode,
  size,
  color,
  quantity
) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  const product = await Product.findOne({ code: productCode });
  if (!product) throw new Error("Product not found");

  const sizeData = product.inventory.find((s) => s.size === size);
  if (!sizeData) throw new Error("Size not found for this product");

  const colorData = sizeData.colors.find((c) => c.name === color);
  if (!colorData) throw new Error("Color not found for this product size");

  if (colorData.amount < quantity)
    throw new Error("Not enough stock available");

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === product._id.toString() &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: product._id, size, color, quantity });
  }

  await cart.save();
  await cart.updateTotalPrice();

  colorData.amount -= quantity;
  if (colorData.amount === 0) colorData.available = false;

  sizeData.available = sizeData.colors.some((c) => c.available);
  product.available = product.inventory.some((s) => s.available);

  await product.save();

  return cart;
};

/**
 * Retrieves a cart by its ID, including populated product details.
 * @param {string} cartId - ID of the cart.
 * @returns {Promise<Object|null>} - Cart object or null if not found.
 */
export const getCart = async (cartId) => {
  const cart = await Cart.findById(cartId).populate("items.product").exec();
  if (!cart) throw new Error("Cart not found");
  return cart;
};

/**
 * Updates the quantity of a product in the cart.
 * @param {string} cartId - ID of the cart.
 * @param {string} productCode - Code of the product.
 * @param {string} size - Size of the product.
 * @param {string} color - Color of the product.
 * @param {number} newQuantity - New quantity to set.
 * @returns {Promise<Object>} - Updated cart.
 */
export const updateProductQuantity = async (
  cartId,
  productCode,
  size,
  color,
  newQuantity
) => {
  const cart = await Cart.findById(cartId).populate("items.product").exec();
  if (!cart) throw new Error("Cart not found");

  const cartItem = cart.items.find(
    (item) =>
      item.product.code === productCode &&
      item.size === size &&
      item.color === color
  );
  if (!cartItem)
    throw new Error("Product with given size and color not found in cart");

  if (newQuantity < 1)
    throw new Error("Quantity must be greater than or equal to 1");

  const product = cartItem.product;
  const sizeData = product.inventory.find((s) => s.size === size);
  if (!sizeData) throw new Error("Size not found in product inventory");

  const colorData = sizeData.colors.find((c) => c.name === color);
  if (!colorData) throw new Error("Color not found in product inventory");

  const currentQuantity = cartItem.quantity;

  if (newQuantity > currentQuantity) {
    const quantityToDecrease = newQuantity - currentQuantity;
    if (colorData.amount < quantityToDecrease)
      throw new Error("Not enough stock available");
    colorData.amount -= quantityToDecrease;
  } else {
    const quantityToIncrease = currentQuantity - newQuantity;
    colorData.amount += quantityToIncrease;
  }

  colorData.available = colorData.amount > 0;
  sizeData.available = sizeData.colors.some((c) => c.available);
  product.available = product.inventory.some((s) => s.available);
  cartItem.quantity = newQuantity;

  await cart.save();
  await product.save();
  await cart.updateTotalPrice();

  return cart;
};

/**
 * Removes a product from the cart and restores its stock.
 * @param {string} cartId - ID of the cart.
 * @param {string} productCode - Code of the product.
 * @param {string} size - Size of the product.
 * @param {string} color - Color of the product.
 * @returns {Promise<Object>} - Updated cart.
 */
export const deleteProductFromCart = async (
  cartId,
  productCode,
  size,
  color
) => {
  const cart = await Cart.findById(cartId).populate("items.product").exec();
  if (!cart) throw new Error("Cart not found");

  const productIndex = cart.items.findIndex(
    (item) =>
      item.product.code === productCode &&
      item.size === size &&
      item.color === color
  );
  if (productIndex === -1)
    throw new Error("Product with given size and color not found in cart");

  const cartItem = cart.items[productIndex];
  const product = cartItem.product;
  const quantityToReturn = cartItem.quantity;

  const sizeData = product.inventory.find((s) => s.size === size);
  if (!sizeData) throw new Error("Size not found in product inventory");

  const colorData = sizeData.colors.find((c) => c.name === color);
  if (!colorData) throw new Error("Color not found in product inventory");

  colorData.amount += quantityToReturn;
  colorData.available = colorData.amount > 0;
  sizeData.available = sizeData.colors.some((c) => c.available);
  product.available = product.inventory.some((s) => s.available);

  cart.items.splice(productIndex, 1);

  await product.save();
  await cart.save();
  await cart.updateTotalPrice();

  return cart;
};
