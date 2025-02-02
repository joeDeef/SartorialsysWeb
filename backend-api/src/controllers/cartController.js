import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const addProductToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productCode, quantity } = req.body;
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Verificar si el producto existe en la base de datos
    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    // Verificar si la cantidad solicitada es menor o igual a la cantidad disponible en el producto
    if (product.amount < quantity) {
      return res.status(400).send({ message: 'Not enough stock available' });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.product.toString() === product._id.toString());

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Almacenar el ObjectId del producto en vez del productCode
      cart.items.push({ product: product._id, quantity });
    }

    // Guardar el carrito con la nueva información
    await cart.save();

    // Actualizar el totalPrice del carrito
    await cart.updateTotalPrice();

    // Disminuir la cantidad disponible en el producto
    product.amount -= quantity;

    // Guardar los cambios en el producto
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
    .populate('items.product')     // Poblamos el campo 'product' dentro de cada item del carrito
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
    const { productCode } = req.query;
    const { newQuantity } = req.body;
    
    // Verificar si el carrito existe
    const cart = await Cart.findById(cartId)
      .populate('items.product') // Poblamos los productos en los ítems
      .exec();

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Verificar si el producto está en el carrito
    const cartItem = cart.items.find(item => item.product.code === productCode);

    if (!cartItem) {
      return res.status(404).send({ message: 'Product not found in cart' });
    }

    // Verificar si la cantidad solicitada es válida
    if (newQuantity < 1) {
      return res.status(400).send({ message: 'Quantity must be greater than or equal to 1' });
    }

    // Verificar el cambio en la cantidad
    const product = cartItem.product;
    const currentQuantity = cartItem.quantity;

    if (newQuantity > currentQuantity) {
      // Si la cantidad aumenta, disminuir la diferencia en el inventario
      const quantityToDecrease = newQuantity - currentQuantity;

      if (product.amount < quantityToDecrease) {
        return res.status(400).send({ message: 'Not enough stock available' });
      }

      product.amount -= quantityToDecrease; // Reducir el stock
    } else if (newQuantity < currentQuantity) {
      // Si la cantidad disminuye, agregar la diferencia al inventario
      const quantityToIncrease = currentQuantity - newQuantity;
      product.amount += quantityToIncrease; // Aumentar el stock
    }

    // Actualizar la cantidad del producto en el carrito
    cartItem.quantity = newQuantity;

    // Actualizar el totalPrice del carrito
    await cart.updateTotalPrice();

    // Guardar los cambios en el carrito y producto
    await cart.save();
    await product.save(); // Guardar cambios en el producto (stock actualizado)

    res.status(200).send({ message: 'Product quantity updated successfully', cart });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cartId } = req.params; // ID del carrito
    const { productCode } = req.query; // Código del producto a eliminar

    // Verificar si el carrito existe
    const cart = await Cart.findById(cartId)
      .populate('items.product') // Poblamos los productos en los ítems
      .exec();

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    // Buscar el producto en el carrito
    const productIndex = cart.items.findIndex(item => item.product.code === productCode);

    if (productIndex === -1) {
      return res.status(404).send({ message: 'Product not found in cart' });
    }

    // Obtener el producto y la cantidad eliminada
    const cartItem = cart.items[productIndex];
    const product = cartItem.product;
    const quantityToReturn = cartItem.quantity;

    // Eliminar el producto del carrito
    cart.items.splice(productIndex, 1);

    // Devolver la cantidad del producto al inventario
    product.amount += quantityToReturn;

    // Actualizar el totalPrice del carrito
    await cart.updateTotalPrice();

    // Guardar los cambios en el carrito y producto
    await cart.save();
    await product.save(); // Guardar cambios en el producto (stock actualizado)

    res.status(200).send({ message: 'Product removed from cart and stock updated', cart });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};
