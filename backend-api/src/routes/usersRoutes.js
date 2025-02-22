import express from "express";
import * as userController from "../controllers/userController.js";
import { userQueryParser } from "../middlewares/userQueryParser.js";

const router = express.Router();

router.post("", userController.createUser);

router.get("", userQueryParser, userController.getUsers);
router.get("/:id", userController.getUser);

router.put("/:id", userController.updateUser);
router.patch("/:id", userController.updatePartialUser);

router.delete("/:id", userController.deleteUser);

export default router;