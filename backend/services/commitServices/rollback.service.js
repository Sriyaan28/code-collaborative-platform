import { CommitModel } from "../../models/CommitModel.js";
import { getFileService } from "../fileServices/get.service.js";
import { updateFileService } from "../fileServices/update.service.js";
import { FileModel } from "../../models/FileModel.js";

export const rollbackService = async (commitId) => {
    try {
        // getting the commit we want to rollback to
        const commit = await CommitModel.findById(commitId);
        if (!commit) {
            throw new Error("Commit not found");
        }

        // Fetch all current files in the branch
        const currentFiles = await FileModel.find({ branch: commit.branch });

        const snapshotMap = new Map();
        if (commit.file_snapshots && commit.file_snapshots.length > 0) {
            commit.file_snapshots.forEach(snapshot => {
                snapshotMap.set(snapshot.file_id.toString(), snapshot);
            });
        } else {
            // Fallback for old commits that only have files_changed
            console.log("Warning: Rolling back to an old commit without file_snapshots. Newly created files will not be deleted.");
        }

        const updatePromises = [];

        if (commit.file_snapshots && commit.file_snapshots.length > 0) {
            // 1. Delete files that were created AFTER this commit (they are in currentFiles but not in snapshotMap)
            currentFiles.forEach(file => {
                if (!file.isDeleted && !snapshotMap.has(file._id.toString())) {
                    // Soft delete
                    file.isDeleted = true;
                    file.modifiedAt = Date.now();
                    updatePromises.push(file.save());
                }
            });

            // 2. Restore files that are in the snapshot
            commit.file_snapshots.forEach(snapshot => {
                const existingFile = currentFiles.find(f => f._id.toString() === snapshot.file_id.toString());
                
                if (!existingFile) {
                    // File was permanently deleted, recreate it
                    updatePromises.push(
                        FileModel.create({
                            _id: snapshot.file_id,
                            name: snapshot.name,
                            repository: commit.repository,
                            branch: commit.branch,
                            createdBy: commit.author,
                            content: snapshot.content,
                            old_content: snapshot.content,
                            isDeleted: false
                        })
                    );
                } else {
                    // File exists, restore content and undelete if necessary
                    existingFile.isDeleted = false;
                    existingFile.old_content = existingFile.content;
                    existingFile.content = snapshot.content;
                    existingFile.modifiedAt = Date.now();
                    updatePromises.push(existingFile.save());
                }
            });
        } else {
            // FALLBACK LOGIC for legacy commits without file_snapshots
            commit.files_changed.forEach(fileObj => {
                const existingFile = currentFiles.find(f => f._id.toString() === fileObj.file_id.toString());
                if (!existingFile) {
                    if (fileObj.content && fileObj.content.new_content) {
                        updatePromises.push(
                            FileModel.create({
                                _id: fileObj.file_id,
                                name: `restored_file_${fileObj.file_id.toString().substring(0, 5)}`,
                                repository: commit.repository,
                                branch: commit.branch,
                                createdBy: commit.author,
                                content: fileObj.content.new_content,
                                old_content: fileObj.content.new_content,
                                isDeleted: false
                            })
                        );
                    }
                } else {
                    if (existingFile.isDeleted) {
                        existingFile.isDeleted = false;
                        existingFile.old_content = existingFile.content;
                        existingFile.content = fileObj.content.new_content;
                        existingFile.modifiedAt = Date.now();
                        updatePromises.push(existingFile.save());
                    } else {
                        updatePromises.push(
                            updateFileService({
                                fileId: fileObj.file_id,
                                content: fileObj.content.new_content
                            })
                        );
                    }
                }
            });
        }

        await Promise.all(updatePromises);

        return commit;

    } catch (error) {
        console.log(error);
        throw error;
    }
}