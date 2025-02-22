import {
  sendErrorResponse,
  sendSuccessResponse,
  printLogsError,
} from "../utils/messages.js";
import { loginUserService } from "../services/authService.js";
import { WrongEmailError, WrongPasswordError } from "../errors/authErrors.js";

export const loggingUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokenLogin = await loginUserService(email, password);
    sendSuccessResponse(res, "Login successful", tokenLogin);
  } catch (error) {
    if (
      error instanceof WrongEmailError ||
      error instanceof WrongPasswordError
    ) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
    printLogsError(error.message);
    sendErrorResponse(res, error.message);
  }
};
