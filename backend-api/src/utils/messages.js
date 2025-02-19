export const sendErrorResponse = (res, errorMessage, responseMessage = "Internal Server Error" , statusCode = 500) => {
    console.error(errorMessage);
    res.status(statusCode).json({ message : responseMessage});
  };
  
export const sendSuccessResponse = (res, message, data, statusCode = 200) => {
    res.status(statusCode).json({ message, data });
};