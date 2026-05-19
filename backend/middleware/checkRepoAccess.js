// middleware to check if the user has access to the repository before allowing them to create a file in that repository
import { UserModel } from '../models/UserModel.js';
import { RepositoryModel } from '../models/RepositoryModel.js';
import { CollaboratorModel } from '../models/CollaboratorModel.js';

export const checkRepoAccess = async (req, res, next) => {
    try {
        const uid = req.user?.id;
        if (!uid) {
            return res.status(400).json({ error: "User ID not found in request", success: false })
        }
        const repoId = req.body?.repoId || req.body?.repository || req.query?.repoId || req.params?.id || req.params?.repoId;
        console.log("Repository ID from request: ", repoId);
        if (!repoId) {
            return res.status(400).json({
                success: false,
                message: "Repository ID is required"
            })
        }
        // check if the user is the owner of the repository 
        const Repository = await RepositoryModel.findById(repoId);
        console.log("Repository: ", Repository);
        console.log("User ID: ", uid);
        console.log("Owner ID: ", Repository.owner);
        // add owner tag to the response object to be used in the controller if needed
        if (Repository && Repository.owner.toString() === uid) {
            req.role = 'owner';
            req.repository = Repository; // add the repository object to the request object to be used in the controller if needed
            return next();
        }

        // check if user is blocked in any repository (global block)
        const isBlocked = await CollaboratorModel.findOne({ user: uid, role: 'blocked' });
        if (isBlocked) {
            return res.status(403).json({ message: "You've been blocked from accessing repositories", success: false })
        }

        // check if user is a collaborator in the repository
        const collabRepository = await CollaboratorModel.findOne({ repo: repoId, user: uid });
        if (collabRepository) {
            req.role = collabRepository.role; // set the role of the user in the request object to be used in the controller if needed
            return next();
        }

        // if repository is public, then the user has viewer access to the repository
        if (Repository && Repository.visibility === 'PUBLIC') {
            req.role = 'viewer';
            return next();
        }

        // if Repository doesnt exists, then return error
        if (!Repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found"
            })
        }

        // if the user is neither the owner, collaborator nor a viewer, then they do not have access to the repository
        return res.status(403).json({
            success: false,
            message: "You do not have access to this repository"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
