import { UserModel } from "../../models/UserModel.js";
    
//delete user
export const deleteController = async (req, res) => {
    try {
        const uid = req.user?.id;

        const user = await UserModel.findById(uid);
        
        // check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        //check if user isActive
        if (!user.isActive) {
            return res.status(400).json({ message: 'user already deleted' });
        }
        //deactivate user
        user.isActive = false;
        await user.save();
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}