import axiosInstance from "./axios";


// CREATE FILE
export const createFile = async (
    fileData
) => {

    const res = await axiosInstance.post(
        "/files/file",
        fileData
    );

    return res.data;
};


// GET FILES OF BRANCH
export const getBranchFiles = async (
    repoId,
    branchId
) => {

    const res = await axiosInstance.get(
        `/files/repo/${repoId}/branch/${branchId}`
    );

    return res.data;
};


// GET MAIN BRANCH FILES
export const getMainBranchFiles = async (
    repoId
) => {

    const res = await axiosInstance.get(
        `/files/repo/${repoId}/branch/main`
    );

    return res.data;
};


// GET FILE BY ID
export const getFileById = async (
    fileId
) => {

    const res = await axiosInstance.get(
        `/files/file/${fileId}`
    );

    return res.data;
};


// UPDATE FILE
export const updateFile = async (
    fileData
) => {

    const res = await axiosInstance.put(
        `/files/file`,
        fileData
    );

    return res.data;
};


export const deleteFile = async (
    fileId,
    repoId
) => {

    const res = await axiosInstance.put(
        `/files/file/toggle-delete/${fileId}`,
        {
            repoId,
            isDeleted: true
        }
    );

    return res.data;
};