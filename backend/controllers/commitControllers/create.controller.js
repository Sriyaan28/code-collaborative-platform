import { CommitModel } from "../../models/CommitModel.js";
import { FileModel } from "../../models/FileModel.js";
import { createNotification } from "../../services/notificationServices/create.service.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { createInitialCommit } from "../../services/commitServices/create.service.js";

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

        // find existing commits in the repository
        const existingCommits = await CommitModel.find({ repository });
        const isInitialCommit = existingCommits.length === 0;

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
            }).populate("branch", "_id name");
            // invalid/deleted file
            if (!file || file.isDeleted) {
                continue;
            }
            // set branch from first file
            const branchIdStr = (file.branch._id || file.branch).toString();
            if (!commitBranch) {
                commitBranch = branchIdStr;
            }

            // ensure all files belong to same branch
            if (branchIdStr !== commitBranch) {
                return res.status(400).json({
                    message: "Cannot commit files from different branches",
                    success: false
                });
            }

            // determine action
            let action = "UPDATE";

            if (file.old_content === null) {
                action = "CREATE";
            }

            // skip unchanged files unless it's the initial commit
            if (!isInitialCommit && file.old_content === file.content) {
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

        // populate file snapshots for the commit
        const activeFiles = await FileModel.find({ 
            branch: commitBranch, 
            isDeleted: false 
        });

        const file_snapshots = activeFiles.map(f => ({
            file_id: f._id,
            name: f.name,
            content: f.content || ""
        }));

        // create commit
        let commit;
        if (isInitialCommit) {
            commit = await createInitialCommit({
                repository,
                message,
                branch: commitBranch,
                author: uid,
                files_changed,
                file_snapshots
            });
        } else {
            commit = await CommitModel.create({
                message,
                repository,
                branch: commitBranch,
                author: uid,
                files_changed,
                file_snapshots
            });
        }

        const repo = await RepositoryModel.findById(repository);
        // send notification to repo owner
        await createNotification({
            user: repo.owner,
            type: "COMMIT_CREATED",
            reference_id: commit._id,
            reference_type: "COMMIT"
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