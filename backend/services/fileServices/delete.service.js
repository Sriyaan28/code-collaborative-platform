import { FileModel } from "../../models/FileModel.js";
// delete files by id
export const deleteFile = async ({ fileId }) => {
    try {
        if (!fileId) {
            throw new Error("File ID is required");
        }
        const file = await FileModel.findByIdAndDelete(fileId);
        return file;
    }
    catch (err) {
        console.error(err.message);
        throw err;
    }
}