import axiosInstance from "./axios";


// GET ALL NOTIFICATIONS
export const getNotifications = async () => {

    const res = await axiosInstance.get(
        "/notifications/all-notifications"
    );

    return res.data;
};


// GET NOTIFICATION BY ID
export const getNotificationById = async (
    notificationId
) => {

    const res = await axiosInstance.get(
        `/notifications/notification/${notificationId}`
    );

    return res.data;
};


// MARK SINGLE AS READ
export const markNotificationRead = async (
    notificationId
) => {

    const res = await axiosInstance.patch(
        `/notifications/notification/${notificationId}`
    );

    return res.data;
};


// MARK ALL AS READ
export const markAllNotificationsRead = async () => {

    const res = await axiosInstance.put(
        "/notifications/all-notifications"
    );

    return res.data;
};


// DELETE NOTIFICATION
export const deleteNotification = async (
    notificationId
) => {

    const res = await axiosInstance.delete(
        `/notifications/notification/${notificationId}`
    );

    return res.data;
};


// DELETE ALL
export const deleteAllNotifications = async () => {

    const res = await axiosInstance.delete(
        "/notifications/all-notifications"
    );

    return res.data;
};