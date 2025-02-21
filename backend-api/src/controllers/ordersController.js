import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

export const saveOrder = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId).populate('items.product');

    if (!cart) {
      return res.status(404).send({ message: 'Cart not found' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product) continue;

      // Buscar la talla y color dentro del inventario del producto
      const sizeData = product.inventory.find(s => s.size === item.size);
      if (!sizeData) {
        return res.status(400).send({ message: `Size ${item.size} not found for product ${product.name}` });
      }

      const colorData = sizeData.colors.find(c => c.name === item.color);
      if (!colorData) {
        return res.status(400).send({ message: `Color ${item.color} not found for product ${product.name}` });
      }

      // Calcular el total por producto
      const totalPrice = item.quantity * product.price;
      orderItems.push({
        productId: product._id,
        code: product.code,
        name: product.name,
        unitPrice: product.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        totalPrice: totalPrice
      });

      subtotal += totalPrice;
    }

    // Crear la nueva orden
    const order = new Order({
      user: cart.user,
      shippingInfo: req.body.shippingInfo,
      paymentInfo: req.body.paymentInfo,
      items: orderItems,
      subtotal: subtotal,
      orderDate: new Date(),
      status: 'Pendiente'
    });

    await order.save();

    // Vaciar el carrito después de guardar la orden
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).send({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};

// Obtener órdenes por usuario
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(204).json({ message: "No orders found" });
    }

    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
