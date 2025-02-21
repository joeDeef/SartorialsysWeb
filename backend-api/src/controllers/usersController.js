import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Cart from "../models/Cart.js";
import { sendErrorResponse, sendSuccessResponse } from "../utils/messages.js";

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
    const { filter, pagination, sort } = req.queryParams;

    const users = await User.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort);

    if (!users.length) return sendErrorResponse(res, "No users found", 204);
    sendSuccessResponse(res, "Users retrieved successfully", users);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, active: true }).select(
      "-password"
    );
    if (!user) return sendErrorResponse(res, "", "User not found", 404);
    sendSuccessResponse(res, "User retrieved successfully", user);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userData = req.body;

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const updatedUser = await Product.findOneAndUpdate(
      { _id: req.params.id },
      userData,
      { new: true }
    );

    if (!updatedUser) return sendErrorResponse(res, "", "User not found", 404);

    sendSuccessResponse(res, "User updated successfully", userUpdated);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const updatePartialUser = async (req, res) => {
  try {
    const userData = req.body;

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const userUpdated = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: userData },
      { new: true }
    );
    if (!userUpdated) return sendErrorResponse(res, "", "User not found", 404);

    sendSuccessResponse(res, "User updated successfully", userUpdated);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { active: false },
      { new: true }
    );

    if (!userDeleted) return sendErrorResponse(res, "", "User not found", 404);

    await Cart.findOneAndUpdate(
      { user: userDeleted._id },
      { deleted: true }
    );
    

    sendSuccessResponse(res, "User deleted");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};
