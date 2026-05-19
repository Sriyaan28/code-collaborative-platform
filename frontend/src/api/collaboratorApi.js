import axiosInstance from "./axios";


// ADD COLLABORATOR
export const addCollaborator = async (
    collaboratorData
) => {

    const res = await axiosInstance.post(
        "/collaborator/new",
        collaboratorData
    );

    return res.data;
};


// GET ALL COLLABORATORS
export const getCollaborators = async (
    repoId
) => {

    const res = await axiosInstance.get(
        `/collaborator/collabs/${repoId}`
    );

    return res.data;
};


// GET SINGLE COLLABORATOR
export const getCollaborator = async (
    collabId
) => {

    const res = await axiosInstance.get(
        `/collaborator/collab/${collabId}`
    );

    return res.data;
};


// UPDATE COLLABORATOR
export const updateCollaborator = async (
    collabId,
    updateData
) => {

    const res = await axiosInstance.patch(
        `/collaborator/collab/${collabId}`,
        updateData
    );

    return res.data;
};


// DELETE BY USER ID
export const removeCollaboratorByUser = async (
    repoId,
    userId
) => {

    const res = await axiosInstance.delete(
        `/collaborator/repo/${repoId}/collab/${userId}`
    );

    return res.data;
};


// DELETE BY COLLAB ID
export const removeCollaborator = async (
    collabId
) => {

    const res = await axiosInstance.delete(
        `/collaborator/collab/${collabId}`
    );

    return res.data;
};