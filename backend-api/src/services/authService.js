import jwt from "jsonwebtoken";
import variables from "../config/env.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { WrongEmailError, WrongPasswordError } from "../errors/authErrors.js";

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new WrongEmailError();
  }

  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    throw new WrongPasswordError();
  }

  // Generamos el token
  const token = jwt.sign({ id: user._id }, variables.SECRET_KEY, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      cartID: user.cart._id,
    },
  };
};
