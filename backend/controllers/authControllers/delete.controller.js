import { compare } from 'bcrypt'
import { UserModel } from "../../models/UserModel.js";
import { CommentModel } from '../../models/CommentModel.js';
import { FileModel } from '../../models/FileModel.js';
import { IssuesModel } from '../../models/IssuesModel.js';
import { PRModel } from '../../models/PRModel.js';
import { BranchModel } from '../../models/BranchModel.js';
import { CollaboratorModel } from '../../models/CollaboratorModel.js';
import { deleteCommentByIdService } from '../../services/commentServices/delete.service.js';
import { deleteFile } from '../../services/fileServices/delete.service.js';
import { deleteIssueByIdService } from '../../services/issueServices/delete.service.js';
import { deletePRByIdService } from '../../services/prServices/delete.service.js';
import { deleteBranch } from '../../services/branchServices/delete.service.js';
import { deleteCollabByIdService } from '../../services/collabServices/delete.service.js';
import { deleteRepoByIdService } from '../../services/repoServices/delete.service.js';
import { RepositoryModel } from '../../models/RepositoryModel.js';

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

        // delete all comments by user using delete comment service
        // fetch all comments by user and then delete by passing comment id
        const comments = await CommentModel.find({ author: uid });
        comments.forEach(async (comment) => {
            await deleteCommentByIdService({ commentId: comment._id });
        });

        // delete all issues by user using delete issue service
        const issues = await IssuesModel.find({ createdBy: uid });
        issues.forEach(async (issue) => {
            await deleteIssueByIdService({ issueId: issue._id });
        });

        // delete all pull requests by user using delete PR service
        const pullRequests = await PRModel.find({ author: uid });
        pullRequests.forEach(async (pr) => {
            await deletePRByIdService({ prId: pr._id });
        });

        // delete all files by user using delete file service
        const files = await FileModel.find({ author: uid });
        files.forEach(async (file) => {
            await deleteFile({ fileId: file._id });
        });

        // delete all branches by user using delete branch service
        const branches = await BranchModel.find({ author: uid });
        branches.forEach(async (branch) => {
            await deleteBranch({ branchId: branch._id });
        });

        // delete all collaborators by user using delete collaborator service
        const collaborators = await CollaboratorModel.find({ user: uid });
        collaborators.forEach(async (collaborator) => {
            await deleteCollabByIdService({ collabId: collaborator._id });
        });

        // delete all repositories by user using delete repository service
        const repositories = await RepositoryModel.find({ owner: uid });
        repositories.forEach(async (repository) => {
            await deleteRepoByIdService({ repoId: repository._id });
        });

        await UserModel.findByIdAndDelete(uid);

        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}