import Cart from '../models/Cart.js';
import Order from '../models/Order.js'

export const saveOrder = async (req, res) => {
    try {
        var { cartId } = req.params;
        const cart = await Cart.findById(cartId).populate('items.product');

        if (!cart) {
          throw new Error('Cart not found');
        }
    
        // 2. Prepara los ítems del pedido basados en el carrito
        const orderItems = [];
        let orderTotalPrice = 0;
    
        for (const item of cart.items) {
          const product = item.product;
          if (product) {
            const totalPrice = item.quantity * product.price;
            orderItems.push({
              code: product.code,
              name: product.name,
              unitPrice: product.price,
              size: product.size,
              color: product.color,
              quantity: item.quantity,
              totalPrice: totalPrice
            });
            orderTotalPrice += totalPrice;
          }
        }
    
        // 3. Crea el nuevo pedido
        const order = new Order({
          user: cart.user,
          shippingInfo: req.body.shippingInfo,
          paymentInfo: req.body.paymentInfo,
          items: orderItems,
          subtotal: orderTotalPrice,
          orderTotalPrice: orderTotalPrice,
          orderDate: new Date(),
          status: 'Pendiente'
        });
    
        // 4. Guarda el pedido en la base de datos
        await order.save();
    
        // 5. Vacía el carrito después de guardar el pedido
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    
        res.status(200).send({ message: 'Order placed successfully', order });
      } catch (error) {
        res.status(500).send({ message: 'Server error', error });
      }
    };

export const getOrders = async (req, res) => {
    try{
        var { userId }= req.params
        const orders = await Order.find({user: userId});

        if (!orders || orders.length === 0) {
        return res.status(204).json({ message: "No orders found" });
        }

        res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};