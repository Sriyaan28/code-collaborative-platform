import axiosInstance from "./axios";

// CREATE PULL REQUEST
export const createPullRequest = async (data) => {
    const res = await axiosInstance.post(
        "/pull-requests/pull-request",
        data
    );
    return res.data;
};

// GET ALL PULL REQUESTS
export const getAllPullRequests = async (repoId) => {
    const res = await axiosInstance.get(
        `/pull-requests/repo/${repoId}/pull-request`
    );
    return res.data;
};

// GET PULL REQUEST BY ID
export const getPullRequestById = async (prId) => {
    const res = await axiosInstance.get(
        `/pull-requests/pull-request/${prId}`
    );
    return res.data;
};

// UPDATE PR STATUS
export const updatePRStatus = async (prId, status) => {
    const res = await axiosInstance.put(
        `/pull-requests/pull-request/${prId}`,
        { status }
    );
    return res.data;
};

// DELETE PULL REQUEST
export const deletePullRequest = async (prId) => {
    const res = await axiosInstance.delete(
        `/pull-requests/pull-request/${prId}`
    );
    return res.data;
};
