import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from '../utils/swagger.js';
import usersRoutes from './usersRoutes.js';
import productsRoutes from './productsRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './ordersRoutes.js'
import authRoutes from './authRoutes.js'

const router = express.Router();

//Documentation
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//Routes
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartRoutes)
router.use('/order', orderRoutes)
router.use('/auth', authRoutes)

//Routes not Found
router.use((req, res) => {
  res.status(404).send({message: `Not Found - Ruta: ${req.url}`});
});

export default router;