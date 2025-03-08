import express from "express";
import * as db from "./config/db.js";
import variables from "./config/env.js";
import router from "./routes/routes.js";
import cors from "cors";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use(router);

// Init Serve
app.listen(variables.PORT, () => {
  console.log(`Server running at port -> ${variables.PORT}`);
  console.log(
    `Documentation available at -> localhost:${variables.PORT}/api-docs/`
  );
});

// Database Conexion
db.dbconnect();

export default app;
