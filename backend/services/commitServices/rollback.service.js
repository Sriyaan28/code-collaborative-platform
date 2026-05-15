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

        // getting all the files in the commit and updating them using forEach
        // we pass fileId and content for updateFileService
        const updatePromises = commit.files_changed.map(async (fileObj) => {
            const file = await FileModel.findById(fileObj.file_id);
            
            if (!file) {
                // If the file is permanently deleted but we have content, recreate it
                if (fileObj.content && fileObj.content.new_content) {
                    await FileModel.create({
                        _id: fileObj.file_id,
                        name: `restored_file_${fileObj.file_id.toString().substring(0, 5)}`,
                        repository: commit.repository,
                        branch: commit.branch,
                        createdBy: commit.author,
                        content: fileObj.content.new_content,
                        old_content: fileObj.content.new_content,
                        isDeleted: false
                    });
                }
            } else {
                // If it's softly deleted, restore it and update content
                if (file.isDeleted) {
                    file.isDeleted = false;
                    file.old_content = file.content;
                    file.content = fileObj.content.new_content;
                    file.modifiedAt = Date.now();
                    await file.save();
                } else {
                    // Update normally if it exists and is active
                    await updateFileService({
                        fileId: fileObj.file_id,
                        content: fileObj.content.new_content
                    });
                }
            }
        });

        await Promise.all(updatePromises);

        return commit;

    } catch (error) {
        console.log(error);
        throw error;
    }
}