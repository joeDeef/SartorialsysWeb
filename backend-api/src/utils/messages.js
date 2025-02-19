export const sendErrorResponse = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ message });
  };
  
export const sendSuccessResponse = (res, message, data, statusCode = 200) => {
    res.status(statusCode).json({ message, data });
};