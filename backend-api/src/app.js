import express from 'express';
import cors from 'cors'; // Importa cors
import path from 'path'; // Importa path
import * as db from './config/db.js';
import { PORT } from './config/env.js';
import router from './routes/routes.js';

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:4200', // Permitir solicitudes desde este origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde "uploads"
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Registrar rutas
app.use(router);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running at port -> ${PORT}`);
  console.log(`Documentation available at -> localhost:${PORT}/api-docs/`);
});

// Conexión a la base de datos
db.dbconnect();

export default app;
