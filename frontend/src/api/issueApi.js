import axiosInstance from "./axios";

export const createIssue = async (data) => {
    const res = await axiosInstance.post("/issues/issue", data);
    return res.data;
};

export const deleteIssue = async (issueId) => {
    const res = await axiosInstance.delete(`/issues/issue/${issueId}`);
    return res.data;
};

export const getIssueById = async (issueId) => {
    const res = await axiosInstance.get(`/issues/issue/${issueId}`);
    return res.data;
};

export const getAllIssues = async (repoId) => {
    const res = await axiosInstance.get(`/issues/repo/${repoId}/all-issues`);
    return res.data;
};

export const updateIssueStatus = async (issueId, status) => {
    const res = await axiosInstance.patch(`/issues/issue/${issueId}`, { status });
    return res.data;
};

// GET ASSIGNED ISSUES (GLOBAL)
export const getAssignedIssues = async () => {
    const res = await axiosInstance.get(`/issues/assigned`);
    return res.data;
};
