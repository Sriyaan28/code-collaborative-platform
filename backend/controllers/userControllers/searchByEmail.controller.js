import { UserModel } from "../../models/UserModel.js";

export const searchUsersByEmailController = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const users = await UserModel.find({
      _id: { $ne: req.user.id },
      email: {
        $regex: query,
        $options: "i"
      }
    })
    .select("_id username email userProfile")
    .limit(10);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      payload: users
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
