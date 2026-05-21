import axiosInstance from './axios';

export const createDiscussion = async (data) => {
    const res = await axiosInstance.post('/discussions', data);
    return res.data;
};

export const getAllDiscussions = async (search = "") => {
    const res = await axiosInstance.get(`/discussions?search=${search}`);
    return res.data;
};

export const getDiscussionById = async (id) => {
    const res = await axiosInstance.get(`/discussions/${id}`);
    return res.data;
};

export const toggleLikeDiscussion = async (id) => {
    const res = await axiosInstance.post(`/discussions/${id}/like`);
    return res.data;
};

export const addComment = async (id, content) => {
    const res = await axiosInstance.post(`/discussions/${id}/comment`, { content });
    return res.data;
};

export const deleteDiscussion = async (id) => {
    const res = await axiosInstance.delete(`/discussions/${id}`);
    return res.data;
};

export const deleteComment = async (id, commentId) => {
    const res = await axiosInstance.delete(`/discussions/${id}/comment/${commentId}`);
    return res.data;
};
