import axiosInstance from "./axios";


// CREATE REPOSITORY
export const createRepository = async (
    repositoryData
) => {

    const res = await axiosInstance.post(
        "/repository/repo",
        repositoryData
    );

    return res.data;
};


// GET ALL REPOSITORIES
export const getRepositories = async () => {

    const res = await axiosInstance.get(
        "/repository/all-repos"
    );

    return res.data;
};


// GET REPOSITORY BY ID
export const getRepositoryById = async (
    repoId
) => {

    const res = await axiosInstance.get(
        `/repository/repo/${repoId}`
    );

    return res.data;
};


// SEARCH REPOSITORIES BY NAME
export const searchRepositories = async (
    repoName
) => {

    const res = await axiosInstance.get(
        `/repository/search?repoName=${repoName}`
    );

    return res.data;
};


// UPDATE REPOSITORY
export const updateRepository = async (
    repoId,
    repositoryData
) => {

    const res = await axiosInstance.patch(
        `/repository/repo/${repoId}`,
        repositoryData
    );

    return res.data;
};


// DELETE REPOSITORY
export const deleteRepository = async (
    repoId
) => {

    const res = await axiosInstance.delete(
        `/repository/repo/${repoId}`
    );

    return res.data;
};