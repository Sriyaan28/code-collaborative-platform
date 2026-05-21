import { compare } from 'bcrypt'
import { UserModel } from "../../models/UserModel.js";
import { CommentModel } from '../../models/CommentModel.js';
import { FileModel } from '../../models/FileModel.js';
import { IssuesModel } from '../../models/IssuesModel.js';
import { PRModel } from '../../models/PRModel.js';
import { BranchModel } from '../../models/BranchModel.js';
import { CollaboratorModel } from '../../models/CollaboratorModel.js';
import { RepositoryModel } from '../../models/RepositoryModel.js';
import { CommitModel } from '../../models/CommitModel.js';
import { NotificationModel } from '../../models/NotificationModel.js';


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

        // Delete data directly created by the user
        await CommentModel.deleteMany({ user: uid });
        await IssuesModel.deleteMany({ createdBy: uid });
        await PRModel.deleteMany({ createdBy: uid });
        await FileModel.deleteMany({ createdBy: uid });
        await CommitModel.deleteMany({ author: uid });
        await CollaboratorModel.deleteMany({ user: uid });
        await NotificationModel.deleteMany({ user: uid });

        // Find repositories owned by the user
        const repositories = await RepositoryModel.find({ owner: uid });
        const repoIds = repositories.map(r => r._id);

        // Delete all data associated with those repositories
        if (repoIds.length > 0) {
            await BranchModel.deleteMany({ repository: { $in: repoIds } });
            await FileModel.deleteMany({ repository: { $in: repoIds } });
            await CommitModel.deleteMany({ repository: { $in: repoIds } });
            await PRModel.deleteMany({ repository: { $in: repoIds } });
            await IssuesModel.deleteMany({ repository: { $in: repoIds } });
            await CollaboratorModel.deleteMany({ repo: { $in: repoIds } });
            await RepositoryModel.deleteMany({ owner: uid });
        }

        await UserModel.findByIdAndDelete(uid);

        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}