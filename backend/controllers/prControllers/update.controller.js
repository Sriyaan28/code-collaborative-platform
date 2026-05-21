import { PRModel } from "../../models/PRModel.js";
import { FileModel } from "../../models/FileModel.js";

import { createNotification } from "../../services/notificationServices/create.service.js";
import { mergeFilesService } from "../../services/fileServices/merge.service.js";

// update PR status using prId
export const updatePRStatusController = async (req, res) => {

    try {

        // get uid
        const uid = req.user.id;

        // get prId from params
        const { prId } = req.params;

        // get status from request
        const { status } = req.body;

        // validate status
        const allowedStatus = ["opened", "closed", "merged"];

        if (!status || !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                success: false
            });
        }

        if (!prId) {
            return res.status(400).json({
                message: "Pull request ID not found",
                success: false
            });
        }

        // get the pull request
        const pullRequest = await PRModel.findById(prId)
            .populate("createdBy", "_id name email userProfile")
            .populate("sourceBranch", "_id name")
            .populate("targetBranch", "_id name")
            .populate("mergedBy", "_id name email userProfile")
            .populate("repository", "_id name visibility owner");

        if (!pullRequest) {
            return res.status(404).json({
                message: "Pull request not found",
                success: false
            });
        }

        // only repo owner can merge/update PR
        if (
            pullRequest.repository?.owner?.toString() !==
            uid.toString()
        ) {
            return res.status(403).json({
                message: "You don't have access to update this pull request",
                success: false
            });
        }

        // check if provided status and existing status is same
        if (pullRequest.status === status) {
            return res.status(400).json({
                message: "Pull request is already in the same state",
                success: false
            });
        }

        // ============================================================
        // MERGE PR
        // ============================================================

        if (status === "merged") {

            // check if pull request is closed
            if (pullRequest.status === "closed") {
                return res.status(400).json({
                    message: "Pull request is closed",
                    success: false
                });
            }

            // get source branch files
            const sourceFiles = await FileModel.find({
                branch: pullRequest.sourceBranch._id
            });

            // get target branch files
            const targetFiles = await FileModel.find({
                branch: pullRequest.targetBranch._id
            });

            const mergedFiles = [];

            for (const file of sourceFiles) {

                // find matching target file by name
                const targetFile = targetFiles.find(
                    (f) => f.name === file.name
                );

                // ====================================================
                // if target file exists -> merge
                // ====================================================

                if (targetFile) {

                    await mergeFilesService({
                        sourceFileId: file._id,
                        mainFileId: targetFile._id
                    });

                    mergedFiles.push(targetFile._id);
                }

                // ====================================================
                // if target file does not exist -> create new file
                // ====================================================

                else {

                    const newFile = new FileModel({
                        name: file.name,
                        content: file.content,
                        repository: file.repository,
                        branch: pullRequest.targetBranch._id,
                        createdBy: uid
                    });

                    await newFile.save();

                    mergedFiles.push(newFile._id);
                }
            }

            // update pull request
            pullRequest.status = status;
            pullRequest.mergedBy = uid;
            pullRequest.mergedAt = Date.now();

            await pullRequest.save();

            // create notification
            await createNotification({
                user: pullRequest.createdBy._id,
                type: "PR_MERGED",
                reference_id: pullRequest._id,
                reference_type: "PR"
            });

            return res.status(200).json({
                message: `Pull request merged successfully from ${pullRequest.sourceBranch?.name} to ${pullRequest.targetBranch?.name}`,
                success: true,
                payload: {
                    pullRequest,
                    mergedFiles
                }
            });
        }

        // ============================================================
        // CLOSE PR
        // ============================================================

        if (status === "closed") {

            // check if pull request is already merged
            if (pullRequest.status === "merged") {
                return res.status(400).json({
                    message: "Pull request is already merged",
                    success: false
                });
            }


            pullRequest.status = status;
            pullRequest.closedAt = Date.now();

            await pullRequest.save();

            // create notification
            await createNotification({
                user: pullRequest.createdBy._id,
                type: "PR_CLOSED",
                reference_id: pullRequest._id,
                reference_type: "PR"
            });

            return res.status(200).json({
                message: "Pull request closed successfully",
                success: true,
                payload: pullRequest
            });
        }

        // ============================================================
        // REOPEN PR
        // ============================================================

        if (status === "opened") {

            // merged PR cannot be reopened
            if (pullRequest.status === "merged") {
                return res.status(400).json({
                    message: "Pull request is already merged",
                    success: false
                });
            }

            pullRequest.status = status;

            await pullRequest.save();

            return res.status(200).json({
                message: "Pull request opened successfully",
                success: true,
                payload: pullRequest
            });
        }

    }
    catch (err) {

        return res.status(500).json({
            message: "Pull request update failed",
            success: false,
            error: err.message
        });
    }
};