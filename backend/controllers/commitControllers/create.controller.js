import { CommitModel } from "../../models/CommitModel.js";
import { FileModel } from "../../models/FileModel.js";

import { diffLines } from "diff";

export const createCommitController = async (req, res) => {

    try {

        // logged in user
        const uid = req.user.id;

        // role from middleware
        const role = req.role;

        // access check
        if (role !== "owner" && role !== "collaborator") {
            return res.status(403).json({
                message: "Access denied",
                success: false
            });
        }
        // request body
        const { repository, message, files } = req.body;

        // commit snapshots
        const files_changed = [];

        // diff payload
        const differences = [];

        // commit branch
        let commitBranch = null;

        // process files
        for (const fileId of files) {
            // fetch file by file id and repository id
            const file = await FileModel.findOne({
                _id: fileId,
                repository: repository
            });
            // invalid/deleted file
            if (!file || file.isDeleted) {
                continue;
            }
            // set branch from first file
            if (!commitBranch) {
                commitBranch = file.branch.toString();
            }

            // ensure all files belong to same branch
            if (file.branch.toString() !== commitBranch) {
                return res.status(400).json({
                    message: "Cannot commit files from different branches",
                    success: false
                });
            }

            // determine action
            let action = "UPDATE";

            if (file.old_content === "") {
                action = "CREATE";
            }

            // skip unchanged files
            if (file.old_content === file.content) {
                continue;
            }

            // compute diff
            const diff = diffLines(
                file.old_content || "",
                file.content || ""
            );

            // snapshot
            files_changed.push({
                file_id: file._id,
                content: {
                    old_content: file.old_content || "",
                    new_content: file.content || ""
                },
                action
            });

            // diff payload
            differences.push({
                file_id: file._id,
                file_name: file.name,
                diff
            });

            // update committed state
            file.old_content = file.content;
            await file.save();
        }

        // no changes
        if (files_changed.length === 0) {
            return res.status(400).json({
                message: "No changes detected, cannot create commit",
                success: false
            });
        }

        // create commit
        const commit = await CommitModel.create({
            message,
            repository,
            branch: commitBranch,
            author: uid,
            files_changed
        });

        // success response
        res.status(201).json({

            message: "Commit created successfully",

            payload: {
                commit,
                differences
            },
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to create commit",
            error: err.message,
            success: false
        });
    }
};