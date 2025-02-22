import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Cart from "../models/Cart.js";

/**
 * Creates a new user in the database.
 * @param {Object} userData - Data of the user to create.
 * @returns {Promise<Object>} - Created user.
 */
export const createUserService = async (userData) => {
  return await User.create(userData);
};

/**
 * Retrieves a list of users with filters, pagination, and sorting.
 * @param {Object} queryParams - Query parameters.
 * @returns {Promise<Array>} - List of found users.
 */
export const getUsersService = async (queryParams) => {
  const { filter, pagination, sort } = queryParams;
  return await User.find(filter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort);
};

/**
 * Retrieves a user by ID if they are active.
 * @param {String} id - User ID.
 * @returns {Promise<Object|null>} - Found user or null.
 */
export const getUserService = async (id) => {
  return await User.findOne({ _id: id, active: true }).select("-password");
};

/**
 * Fully updates a user.
 * @param {String} id - User ID.
 * @param {Object} userData - Data of the user to update.
 * @returns {Promise<Object|null>} - Updated user or null.
 */
export const updateUserService = async (id, userData) => {
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

/**
 * Partially updates a user.
 * @param {String} id - User ID.
 * @param {Object} userData - Partial user data.
 * @returns {Promise<Object|null>} - Updated user or null.
 */
export const updatePartialUserService = async (id, userData) => {
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }
  return await User.findByIdAndUpdate(id, { $set: userData }, { new: true });
};

/**
 * Deletes (deactivates) a user and their associated cart.
 * @param {String} id - User ID.
 * @returns {Promise<Object|null>} - Deleted user or null.
 */
export const deleteUserService = async (id) => {
  const userDeleted = await User.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  if (userDeleted) {
    await Cart.findOneAndUpdate({ user: userDeleted._id }, { deleted: true });
  }

  return userDeleted;
};
