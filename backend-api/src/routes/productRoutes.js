import express from "express";
import * as productController from "../controllers/productsController.js";
import { multipartyMiddleware } from "../middlewares/multiparty.js";
import { productQueryParser } from "../middlewares/productQueryParser.js";

const router = express.Router();

router.post("", productController.addProduct);
router.post(
  "/upload-images/:code",
  multipartyMiddleware,
  productController.uploadImages
);
router.post("/:code/add-size", productController.addSize)
router.post("/:code/:size/add-color", productController.addColor)

router.get("", productQueryParser, productController.getProducts);
router.get("/:code", productController.getProduct);

router.put("/:code", productController.updateProduct);
router.patch(
  "/:code",
  productController.updatePartialProduct
);

router.delete("/:code", productController.deleteProduct);
router.delete("/delete-image/:code", productController.deleteImage)
router.delete("/:code/:size/remove", productController.removeSize)
router.delete("/:code/:size/:color/remove", productController.removeColor)

export default router;