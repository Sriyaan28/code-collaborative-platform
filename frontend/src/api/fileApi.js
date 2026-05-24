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
        `/files/repo/${repoId}/branch/${branchId}`,
        { params: { t: Date.now() } }
    );

    return res.data;
};


// GET MAIN BRANCH FILES
export const getMainBranchFiles = async (
    repoId
) => {

    const res = await axiosInstance.get(
        `/files/repo/${repoId}/branch/main`,
        { params: { t: Date.now() } }
    );

    return res.data;
};


// GET FILE BY ID
export const getFileById = async (
    fileId
) => {

    const res = await axiosInstance.get(
        `/files/file/${fileId}`,
        { params: { t: Date.now() } }
    );

    return res.data;
};



// GENERATE CODE USING AI
export const generateCode = async (prompt, currentCode) => {
    const res = await axiosInstance.post("/files/generate-code", {
        prompt,
        currentCode
    });
    return res.data;
};

// SMART MERGE CODE
export const smartMergeCode = async (userContent, latestBackendContent) => {
    const res = await axiosInstance.post("/files/smart-merge", {
        userContent,
        latestBackendContent
    });
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