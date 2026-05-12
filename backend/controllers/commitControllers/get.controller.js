import { CommitModel } from "../../models/CommitModel.js";
import { CollaboratorModel } from "../../models/CollaboratorModel.js";

import { diffLines } from "diff";


// get all commits using repoId
export const getAllCommitsController = async (req, res) => {
    try {
        // role from middleware
        const role = req.role;
        // access check
        if (role !== "owner" && role !== "collaborator" && role !== "viewer") {
            return res.status(403).json({
                message: "Access denied",
                success: false
            });
        }

        // repo id
        const repoId = req.params?.repoId;
        if (!repoId) {
            return res.status(400).json({
                message: "Repository ID is required",
                success: false
            });
        }
        // fetch commits
        const commits = await CommitModel.find({ repository: repoId }).select("message repository author createdAt files_changed")
            .populate(
                "branch",
                "name"
            )
            .populate(
                "author",
                "name email userProfile"
            )
            .sort({ createdAt: -1 });

        // success response
        res.status(200).json({
            message: "Commits fetched successfully",
            payload: { commits },
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch commits",
            error: err.message,
            success: false
        });

    }

};


// get commit by id using commitId
export const getCommitByIdController = async (req, res) => {

    try {

        // logged in user
        const uid = req.user.id;

        // commit id
        const { commitId } = req.params;

        // fetch commit
        const commit = await CommitModel.findById(commitId)
            .populate(
                "author",
                "name email userProfile"
            )
            .populate(
                "repository",
                "name visibility owner"
            )
            .populate(
                "branch",
                "name"
            )
            .populate(
                "files_changed.file_id",
                "name"
            );

        // commit not found
        if (!commit) {
            return res.status(404).json({
                message: "Commit not found",
                success: false
            });
        }

        // repository from commit
        const repository = commit.repository;

        // PRIVATE repo access check
        if (repository.visibility === "PRIVATE") {

            // owner check
            const isOwner = repository.owner.toString() === uid;

            // collaborator check
            const isCollaborator =
                await CollaboratorModel.findOne({
                    repo: repository._id,
                    user: uid
                });

            // access denied
            if (!isOwner && !isCollaborator) {
                return res.status(403).json({
                    message: "Access denied",
                    success: false
                });
            }
        }

        // compute differences
        const differences = commit.files_changed.map(file => {

            const oldContent = file.content.old_content || "";

            const newContent = file.content.new_content || "";

            const diff = diffLines(oldContent, newContent);

            return {
                file_id: file.file_id?._id,
                file_name: file.file_id?.name,
                action: file.action,
                diff
            };
        });

        // success response
        res.status(200).json({
            message: "Commit fetched successfully",
            payload: { commit, differences },
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch commit",
            error: err.message,
            success: false
        });
    }

};