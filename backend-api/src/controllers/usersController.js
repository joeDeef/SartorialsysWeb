import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'SARTORIALSYS';

export const createUser = async (req, res) => {
  try {
    const user = req.body;
    const userCreate = await User.create(user);
    res.status(201).json({message: "User created successfully", userCreate});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if(!users || users.length === 0) {
      return res.status(204).json({ message: "No users found"});
    }

    res.status(200).json({message: "Users retrieved successfully", users});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const userUpdated = await User.findByIdAndUpdate(id, body, {new : true});

    if(!userUpdated){
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({message: "User updated sucessful", userUpdated});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const updatePartialUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const userUpdated = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", userUpdated });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userDeleted = await User.findOneAndDelete(id);

    if(!userDeleted){
      res.status(404).json({message: "User not found"});
    }

    res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const loggingUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Incorrect Email/Unregistered User' });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).send({ message: 'Wrong Password' });
    }

    // Generamos el token
    const token = jwt.sign(
      { 
        id: user._id,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        name: user.name,
        last_name: user.last_name,
        role: user.role,
        cartID: user.cart._id,
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
};
