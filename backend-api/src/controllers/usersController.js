import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cart from '../models/Cart.js';
import variables  from '../config/env.js';

const sendErrorResponse = (res, message, statusCode = 500) => {
  console.error(message);
  res.status(statusCode).json({ message });
};

const sendSuccessResponse = (res, message, data, statusCode = 200) => {
  res.status(statusCode).json({ message, data });
};

export const createUser = async (req, res) => {
  try {
    const user = req.body;
    const userCreate = await User.create(user);
    sendSuccessResponse(res, "User created successfully", userCreate, 201);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) return sendErrorResponse(res, "No users found", 204);
    sendSuccessResponse(res, "Users retrieved successfully", users);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return sendErrorResponse(res, "User not found", 404);
    sendSuccessResponse(res, "User retrieved successfully", user);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const userUpdated = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!userUpdated) return sendErrorResponse(res, "User not found", 404);

    sendSuccessResponse(res, "User updated successfully", userUpdated);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const updatePartialUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userUpdated = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!userUpdated) return sendErrorResponse(res, "User not found", 404);

    sendSuccessResponse(res, "User updated successfully", userUpdated);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findOneAndDelete(id);
    if (!userDeleted) return sendErrorResponse(res, "User not found", 404);

    await Cart.findByIdAndDelete(userDeleted.cart);

    sendSuccessResponse(res, "User deleted successfully");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const loggingUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return sendErrorResponse(res, 'Incorrect Email/Unregistered User', 400);

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) return sendErrorResponse(res, 'Wrong Password', 400);

    const token = jwt.sign(
      { id: user.id, email: user.email },  // El payload
      variables.SECRET_KEY,
      { expiresIn: '1h' }  // Opciones adicionales
    );
    

    sendSuccessResponse(res, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        cartID: user.cart._id,
      }
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};