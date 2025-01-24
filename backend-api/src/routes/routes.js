import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from '../utils/swagger.js';
import usersRoutes from './usersRoutes.js';
import productsRoutes from './productsRoutes.js';

const router = express.Router();

//Documentation
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//Routes
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);

//Routes not Found
router.use((req, res) => {
  res.status(404).send({message: `Not Found - Ruta: ${req.url}`});
});

export default router;