import { FileModel } from "../../models/FileModel.js";

export const updateFileService = async ({ fileId, content }) => {
    const file = await FileModel.findById(fileId);
    if (!file) {
        throw new Error("File not found");
    }
    file.old_content = file.content;
    file.content = content;
    file.modifiedAt = Date.now();
    return await file.save();
}