import express from 'express';
import * as productController from '../controllers/productsController.js';
import { multipartyMiddleware } from '../middlewares/multiparty.js';
import { validateProductData } from '../middlewares/validateProductData.js';

const router = express.Router();

router.post('', multipartyMiddleware, validateProductData, productController.addProduct);
//router.post('/upload-images/:code', multipartyMiddleware, productController.uploadImages);

router.get('', productController.getProducts);
router.get('/:code' ,productController.getProduct);

router.put('/:code', productController.updateProduct);
router.patch('/:code', productController.updatePartialProduct);

router.delete('/:code', productController.deleteProduct);

export default router;