import { FileModel } from "../../models/FileModel.js";

export const createFile = async ({
    name,
    content,
    repoId,
    branchId,
    createdBy
}) => {

    if (!name || !content || !repoId || !branchId) {
        throw new Error(
            "Name, content, repoId and branchId are required"
        );
    }
    console.log("content :", content)

    const newFile = new FileModel({
        name,
        content: content,
        repository: repoId,
        createdBy,
        branch: branchId
    });

    return await newFile.save();
};