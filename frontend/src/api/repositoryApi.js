import axiosInstance from "./axios";

export const getRepositories = async () => {

    const res = await axiosInstance.get(
        "/repository/all-repos"
    );

    return res.data;
};

export const createRepository = async (repositoryData) => {

    const res = await axiosInstance.post(
        "/repository/repo",
        repositoryData
    );

    return res.data;
};

export const searchRepositories = async (query) => {

    const res = await axiosInstance.get(
        `/repository/search?repoName=${query}`
    );

    return res.data;
};