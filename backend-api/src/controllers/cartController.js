import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const addProductToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productCode, size, color, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    const product = await Product.findOne({ code: productCode });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    const sizeData = product.inventory.find(s => s.size === size);
    if (!sizeData) {
      return res.status(400).send({ message: 'Size not found for this product' });
    }

    const colorData = sizeData.colors.find(c => c.name === color);
    if (!colorData) {
      return res.status(400).send({ message: 'Color not found for this product size' });
    }

    if (colorData.amount < quantity) {
      return res.status(400).send({ message: 'Not enough stock available' });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === product._id.toString() &&
              item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: product._id, size, color, quantity });
    }

    await cart.save();

    await cart.updateTotalPrice();

    colorData.amount -= quantity;

    if (colorData.amount === 0) {
      colorData.available = false;
    }

    sizeData.available = sizeData.colors.some(c => c.available);

    product.available = product.inventory.some(s => s.available);

    await product.save();

    res.status(200).send({ message: 'Product added to cart and inventory updated', cart });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};


export const getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId)
    .populate('items.product')
    .exec();
  
    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }
    res.status(200).send({ message: 'Cart Found', cart });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productCode, size, color, newQuantity} = req.body;

    // Verificar si el carrito existe
    const cart = await Cart.findById(cartId)
      .populate('items.product')
      .exec();

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(
      item =>
        item.product.code === productCode &&
        item.size === size &&
        item.color === color
    );

    if (!cartItem) {
      return res.status(404).send({ message: 'Product with given size and color not found in cart' });
    }

    if (newQuantity < 1) {
      return res.status(400).send({ message: 'Quantity must be greater than or equal to 1' });
    }

    const product = cartItem.product;

    const sizeData = product.inventory.find(s => s.size === size);
    if (!sizeData) {
      return res.status(400).send({ message: 'Size not found in product inventory' });
    }

    const colorData = sizeData.colors.find(c => c.name === color);
    if (!colorData) {
      return res.status(400).send({ message: 'Color not found in product inventory' });
    }

    const currentQuantity = cartItem.quantity;

    if (newQuantity > currentQuantity) {
      const quantityToDecrease = newQuantity - currentQuantity;

      if (colorData.amount < quantityToDecrease) {
        return res.status(400).send({ message: 'Not enough stock available' });
      }

      colorData.amount -= quantityToDecrease;
    } else if (newQuantity < currentQuantity) {
      // Si la cantidad disminuye, agregar la diferencia al inventario
      const quantityToIncrease = currentQuantity - newQuantity;
      colorData.amount += quantityToIncrease;
    }

    colorData.available = colorData.amount > 0;
    sizeData.available = sizeData.colors.some(c => c.available);
    product.available = product.inventory.some(s => s.available);
    cartItem.quantity = newQuantity;

    await cart.save();
    await product.save();
    await cart.updateTotalPrice();

    res.status(200).send({ message: 'Product quantity updated successfully', cart });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productCode, size, color } = req.body;

    const cart = await Cart.findById(cartId)
      .populate('items.product')
      .exec();

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex(
      item =>
        item.product.code === productCode &&
        item.size === size &&
        item.color === color
    );

    if (productIndex === -1) {
      return res.status(404).send({ message: 'Product with given size and color not found in cart' });
    }

    const cartItem = cart.items[productIndex];
    const product = cartItem.product;
    const quantityToReturn = cartItem.quantity;

    const sizeData = product.inventory.find(s => s.size === size);
    if (!sizeData) {
      return res.status(400).send({ message: 'Size not found in product inventory' });
    }

    const colorData = sizeData.colors.find(c => c.name === color);
    if (!colorData) {
      return res.status(400).send({ message: 'Color not found in product inventory' });
    }

    colorData.amount += quantityToReturn;
    colorData.available = colorData.amount > 0;
    sizeData.available = sizeData.colors.some(c => c.available);
    product.available = product.inventory.some(s => s.available);
    cart.items.splice(productIndex, 1);

    await product.save();
    await cart.save();
    await cart.updateTotalPrice();

    res.status(200).send({ message: 'Product removed from cart and stock updated', cart });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};