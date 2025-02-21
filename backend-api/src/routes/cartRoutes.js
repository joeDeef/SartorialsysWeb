import express from 'express';
import * as cartController from '../controllers/cartController.js'

const router = express.Router();

router.post('/:cartId', cartController.addProductToCart);

router.get('/:cartId', cartController.getCart);

router.patch('/:cartId', cartController.updateProductQuantity);

router.delete('/:cartId', cartController.deleteProductFromCart);

export default router;