import { UserModel } from "../../models/UserModel.js";

export const searchUsersByNameController = async (req, res) => {
  try {
    const { query } = req.query;

    // If no query is provided, return an error 
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    // Search for users whose username matches the query (case-insensitive)
    // Limit the results to 10 users and select only necessary fields
    const users = await UserModel.find({
      username: {
        $regex: query,
        $options: "i"
      }
    })
    .select("_id username email userProfile")
    .limit(10);

    // Return the search results to the client
    return res.status(200).json({
      success: true,
       payload: users
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};