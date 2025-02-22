import express from "express";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

router.post("/:cartId", orderController.saveOrder);

router.get("/:userId", orderController.getOrders);
export default router;
