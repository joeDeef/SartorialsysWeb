import express from 'express';
import * as productController from '../controllers/productsController.js';
import { multipartyMiddleware } from '../middlewares/multiparty.js';

const router = express.Router();

router.post('', productController.addProduct);
router.post('/upload-images/:code', multipartyMiddleware, productController.uploadImages);

router.get('', productController.getProducts);
router.get('/:code' ,productController.getProduct);

router.put('/:code', productController.updateProduct);

router.delete('/:code', productController.deleteProduct);
router.delete('/delete-image/:code', productController.deleteImage)

export default router;