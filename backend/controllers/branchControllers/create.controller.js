import { BranchModel } from "../../models/BranchModel.js";
import { FileModel } from "../../models/FileModel.js";
import { createNotification } from "../../services/notificationServices/create.service.js";

export const createBranchController = async (req, res) => {
    try {
        const { name, repoId } = req.body;

        if (!name || !repoId) {
            return res.status(400).json({
                success: false,
                message: "Name and repoId are required"
            })
        }

        // get role from req
        const role = req.role;

        // only owner and collaborator can create branch
        if (role === "viewer" || role === "blocked") {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to create a branch"
            })
        }

        // check if branch already exists
        const existingBranch = await BranchModel.findOne({
            name: name,
            repository: repoId
        });

        if (existingBranch) {
            return res.status(400).json({
                success: false,
                message: `${name} branch already exists`
            })
        }

        // check if branch name is valid
        if (!/^[a-z-]+$/.test(name)) {
            return res.status(400).json({
                success: false,
                message: "Invalid branch name (only lowercase alphabets and hyphens are allowed)"
            })
        }

        let mainBranch = null;

        // if other branches are to be created, then there must be a main branch in the repo
        if (name !== "main") {

            // check if there is a main branch in the repo
            mainBranch = await BranchModel.findOne({
                name: "main",
                repository: repoId
            });

            // if there is no main branch, then return an error saying that main branch is not present
            if (!mainBranch) {
                return res.status(400).json({
                    success: false,
                    message: "Main branch not found, create a main branch first"
                })
            }
        }

        // create branch
        const branch = new BranchModel({
            name: name,
            repository: repoId
        });

        await branch.save();

        // if the branch to be created is not main,
        // copy all files from main branch into new branch
        if (name !== "main") {

            const mainBranchFiles = await FileModel.find({
                repository: repoId,
                branch: mainBranch._id
            });

            const duplicatedFiles = mainBranchFiles.map((file) => ({
                name: file.name,
                content: file.content,
                repository: repoId,
                branch: branch._id,
                createdBy: req.user.id
            }));

            if (duplicatedFiles.length > 0) {
                await FileModel.insertMany(duplicatedFiles);
            }
        }

        // create a notification to the owner of the repo
        await createNotification({
            user: req.user.id,
            type: "BRANCH_CREATED",
            reference_id: branch._id,
            reference_type: "BRANCH"
        })

        return res.status(201).json({
            success: true,
            message: "Branch created successfully",
            payload: branch
        })

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to create branch"
        })
    }
}