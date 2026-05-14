import axiosInstance from "./axios";

export const getProfile = async () => {

    const res = await axiosInstance.get(
        "/users/profile"
    );

    return res.data;
};

export const updateProfile = async (
    profileData
) => {

    const res = await axiosInstance.put(
        "/auth/profile",
        profileData
    );

    return res.data;
};
export const deleteProfile = async (
    password
) => {

    const res = await axiosInstance.delete(
        "/auth/profile",
        {
            data: { password }
        }
    );

    return res.data;
};

export const searchUsers = async (
    query,
    searchType
) => {

    const res = await axiosInstance.get(
        `/users/search?${searchType}=${query}`
    );

    return res.data;
};