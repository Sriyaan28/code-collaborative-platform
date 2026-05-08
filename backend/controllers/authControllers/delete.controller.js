import { compare } from 'bcrypt'
import { UserModel } from "../../models/UserModel.js";
    
//delete user
export const deleteController = async (req, res) => {
    try {
        // get user id from token
        const uid = req.user?.id;
        // get password from body of request
        const { password } = req.body;

        if (!uid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required to delete account' });
        }

        const user = await UserModel.findById(uid);
        
        // check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // verify password before deleting
        const isMatched = await compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        await UserModel.findByIdAndDelete(uid);

        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}