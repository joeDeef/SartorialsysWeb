export const sendErrorResponse = (
  res,
  responseMessage = "Internal Server Error",
  statusCode = 500
) => {
  res.status(statusCode).json({ message: responseMessage });
};

export const sendSuccessResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  data
    ? res.status(statusCode).json({ message, data })
    : res.status(statusCode).json(message);
};

export const printLogsError = (messageError) => {
  console.error(messageError);
};