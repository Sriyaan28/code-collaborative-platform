import axiosInstance from "./axios"

// CREATE COMMIT
export const createCommit = async ({
    repository,
    message,
    files
}) => {

    const response =
        await axiosInstance.post(
            "/commits/commit",
            {
                repository,
                message,
                files
            }
        );

    return response.data;
};

// GET ALL COMMITS BY REPOSITORY
export const getRepoCommits = async (
    repositoryId
) => {

    const response =
        await axiosInstance.get(
            `/commits/repo/${repositoryId}`
        );

    return response.data;
};

// GET COMMIT BY ID
export const getCommitById = async (
    commitId
) => {

    const response =
        await axiosInstance.get(
            `/commits/commit/${commitId}`
        );

    return response.data;
};

// ROLLBACK TO COMMIT
export const rollbackCommit = async ({
    repository,
    commitId
}) => {

    const response =
        await axiosInstance.post(
            "/commits/rollback",
            {
                repository,
                commitId
            }
        );

    return response.data;
};