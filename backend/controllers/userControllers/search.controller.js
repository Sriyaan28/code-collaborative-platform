import { UserModel } from "../../models/UserModel.js";

export const searchUsersController = async (req, res) => {
    try {
        const uid = req.user?.id;
        if (!uid) {
            return res.status(400).json({ error: "User ID not found in request" })
        }
        // get name or email from query params
        const { name, email } = req.query;

        // if name is present in query params, search by name, else if email is present, search by email
        if (name) {
            const users = await UserModel.find({
                _id: { $ne: req.user.id },
                name: {
                    $regex: name,
                    $options: "i"
                },
                isActive: true
            })
                .select("_id name email userProfile")
                .limit(10);
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                payload: users
            });
        }
        else if (email) {
            const users = await UserModel.find({
                _id: { $ne: req.user.id },
                email: {
                    $regex: email,
                    $options: "i"
                },
                isActive: true
            })
                .select("_id name email userProfile")
                .limit(10);
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                payload: users
            });
        }
        else    // no query provided
        {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}