import { UserModel } from '../../models/UserModel.js';
import { hash } from 'bcrypt';

export const updateController = async (req, res) => {
    try {
        const modifiedUser = req.body;
        const uid = req.user?.id || req.user?._id;

        // hash password of modifiedUser
        if (modifiedUser.password) {
            modifiedUser.password = await hash(modifiedUser.password, 12)
        }
        // update user
        const updatedUser = await UserModel.findByIdAndUpdate(uid, modifiedUser, { new: true })

        // send notification to user
        await createNotification({
            user: uid,
            type: "PROFILE_UPDATED",
            reference_id: uid,
            reference_type: "USER"
        });

        return res.status(200).json({ message: "User profile updated successfully", payload: updatedUser, success: true })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "User Update failed", error: err })
    }
}