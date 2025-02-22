import {
  createUserService,
  getUsersService,
  getUserService,
  updateUserService,
  updatePartialUserService,
  deleteUserService,
} from "../services/userService.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
  printLogsError,
} from "../utils/messages.js";

export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    sendSuccessResponse(res, "User created successfully", 201, user);
  } catch (error) {
    printLogsError(error.message);
    sendErrorResponse(res);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService(req.queryParams);

    if (!users.length) return sendErrorResponse(res, "No users found", 204);
    sendSuccessResponse(res, "Users retrieved successfully", 200, users);
  } catch (error) {
    printLogsError(error.message);
    sendErrorResponse(res);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserService(req.params.id);
    if (!user) return sendErrorResponse(res, "User not found", 404);
    sendSuccessResponse(res, "User retrieved successfully", 200, user);
  } catch (error) {
    printLogsError(error.message);
    sendErrorResponse(res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    if (!updatedUser) return sendErrorResponse(res, "User not found", 404);
    sendSuccessResponse(res, "User updated successfully", 200, updatedUser);
  } catch (error) {
    printLogsError(error.message);
    sendErrorResponse(res);
  }
};

export const updatePartialUser = async (req, res) => {
  try {
    const updatedUser = await updatePartialUserService(req.params.id, req.body);
    if (!updatedUser) return sendErrorResponse(res, "User not found", 404);
    sendSuccessResponse(res, "User updated successfully", 200, updatedUser);
  } catch (error) {
    printLogsError(error.message);
    sendErrorResponse(res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userDeleted = await deleteUserService(req.params.id);
    if (!userDeleted) return sendErrorResponse(res, "User not found", 404);
    sendSuccessResponse(res, "User deleted");
  } catch (error) {
    printLogsError(error.message);
    sendErrorResponse(res);
  }
};
