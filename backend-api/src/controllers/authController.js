import jwt from "jsonwebtoken";
import variables from "../config/env.js";

export const loggingUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return sendErrorResponse(res, "Incorrect Email/Unregistered User", 400);
  
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) return sendErrorResponse(res,"", "Wrong Password", 400);
  
      const token = jwt.sign(
        { id: user.id, email: user.email }, // El payload
        variables.SECRET_KEY,
        { expiresIn: "1h" } // Opciones adicionales
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
        },
      });
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  };
  