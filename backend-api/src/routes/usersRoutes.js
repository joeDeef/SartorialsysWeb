import express from 'express';
import * as userController from '../controllers/usersController.js';

const router = express.Router();

router.post('', userController.createUser);
router.post('/login', userController.loggingUser);

router.get('', userController.getUsers);
router.get('/:id', userController.getUser);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

export default router;