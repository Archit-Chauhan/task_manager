import User from "../models/User.js";

/**
 * GET /api/users
 * Admin / Manager can view all users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role skills");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message
    });
  }
};
