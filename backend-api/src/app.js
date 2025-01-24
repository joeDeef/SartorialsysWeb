import express from 'express';
import * as db from './config/db.js';
import { PORT } from './config/env.js';
import router from './routes/routes.js';

const app = express();

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running at port -> ${PORT}`);
  console.log(`Documentation available at -> localhost:${PORT}/api-docs/`);
  });

  db.dbconnect();

export default app;