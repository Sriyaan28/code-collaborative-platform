import axiosInstance from "./axios";


// GET ALL BRANCHES OF REPOSITORY
export const getBranches = async (
    repoId
) => {

    const res = await axiosInstance.get(
        `/branches/repo/${repoId}`
    );

    return res.data;
};


// GET SINGLE BRANCH
export const getBranch = async (
    repoId,
    branchName
) => {

    const res = await axiosInstance.get(
        `/branches/repo/${repoId}/branch/${branchName}`
    );

    return res.data;
};


// CREATE BRANCH
export const createBranch = async (
    branchData
) => {

    const res = await axiosInstance.post(
        "/branches/branch",
        branchData
    );

    return res.data;
};


// SWITCH BRANCH
export const switchBranch = async (
    branchId
) => {

    const res = await axiosInstance.patch(
        `/branches/branch/${branchId}`
    );

    return res.data;
};


// DELETE BRANCH
export const deleteBranch = async (
    repoId,
    branchId
) => {

    const res = await axiosInstance.delete(
        `/branches/repo/${repoId}/branch/${branchId}`
    );

    return res.data;
};

// GET BRANCH BY ID
export const getBranchById = async (branchId) => {
    const res = await axiosInstance.get(
        `/branches/branch/${branchId}`
    );
    return res.data;
};