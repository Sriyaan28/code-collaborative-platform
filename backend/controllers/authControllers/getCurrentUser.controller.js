import { UserModel } from "../../models/UserModel.js";

export const getCurrentUserController = async (req, res) => {

    try {

        const user = await UserModel.findById(
            req.user.id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        console.log("user :", user);

        return res.status(200).json({ user: user });

    }
    catch (err) {

        return res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};