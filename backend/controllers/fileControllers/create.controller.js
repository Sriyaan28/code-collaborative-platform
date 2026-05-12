import { FileModel } from '../../models/FileModel.js'

export const createFileController = async (req, res) => {
    try {
        const uid = req.user?.id;
        if (!uid) {
            return res.status(400).json({ error: "User ID not found in request" })
        }
        const { name, content, repoId, branchId } = req.body;

        if (!name || !content || !repoId || !branchId) {
            return res.status(400).json({
                success: false,
                message: "Name, content, repoId and branch are required"
            })
        }

        /* 
            File can only be created if the user has access to the repository, 
            this will be checked in the middleware before reaching this controller.
        */

        // check for 'owner' or 'collaborator' role in the request object which will be set in the middleware   
        const role = req.role;
        console.log("User role in repository: ", role);
        // if the role is viewer, then the user does not have permission to create a file in the repository
        if (role === 'viewer') {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to create a file in this repository"
            })
        }

        const newFile = new FileModel({
            name: name,
            content: content,
            repository: repoId,
            createdBy: uid,
            branch: branchId
        })
        await newFile.save();
        return res.status(201).json({
            success: true,
            message: "File created successfully",
            payload: newFile
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}