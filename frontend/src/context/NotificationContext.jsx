import { createContext, useState, useCallback, useMemo } from "react";
import { 
    getNotifications, getNotificationById, markNotificationRead, 
    markAllNotificationsRead, deleteNotification, deleteAllNotifications 
} from "../api/notificationApi";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [seenNotifications, setSeenNotifications] = useState([]);
    const [unseenNotifications, setUnseenNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const [notification, setNotification] = useState(null);
    const [loadingNotification, setLoadingNotification] = useState(true);

    const fetchNotifications = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoadingNotifications(true);
            const data = await getNotifications();
            setNotifications(data.payload?.allNotifications || []);
            setSeenNotifications(data.payload?.seenNotifications || []);
            setUnseenNotifications(data.payload?.unseenNotifications || []);
        } catch (err) {
            console.log("Failed to fetch notifications", err);
        } finally {
            if (!silent) setLoadingNotifications(false);
        }
    }, []);

    const fetchNotification = useCallback(async (id) => {
        if (!id) return;
        try {
            setLoadingNotification(true);
            const data = await getNotificationById(id);
            setNotification(data.payload);

            if (!data.payload.isRead) {
                await markNotificationRead(id);
                // Also update global list silently
                fetchNotifications();
            }
        } catch (err) {
            console.log("Failed to fetch single notification", err);
        } finally {
            setLoadingNotification(false);
        }
    }, [fetchNotifications]);

    const handleMarkRead = useCallback(async (id) => {
        try {
            await markNotificationRead(id);
            fetchNotifications();
        } catch (err) {
            console.log(err);
        }
    }, [fetchNotifications]);

    const handleMarkAllRead = useCallback(async () => {
        try {
            await markAllNotificationsRead();
            fetchNotifications();
        } catch (err) {
            console.log(err);
        }
    }, [fetchNotifications]);

    const handleDeleteNotification = useCallback(async (id) => {
        try {
            await deleteNotification(id);
            fetchNotifications();
        } catch (err) {
            console.log(err);
        }
    }, [fetchNotifications]);

    const handleDeleteAllNotifications = useCallback(async () => {
        try {
            await deleteAllNotifications();
            fetchNotifications();
        } catch (err) {
            console.log(err);
        }
    }, [fetchNotifications]);

    const value = useMemo(() => ({
        notifications,
        seenNotifications,
        unseenNotifications,
        loadingNotifications,
        notification,
        loadingNotification,
        fetchNotifications,
        fetchNotification,
        handleMarkRead,
        handleMarkAllRead,
        handleDeleteNotification,
        handleDeleteAllNotifications
    }), [
        notifications, seenNotifications, unseenNotifications, loadingNotifications, 
        notification, loadingNotification, fetchNotifications, fetchNotification, 
        handleMarkRead, handleMarkAllRead, handleDeleteNotification, handleDeleteAllNotifications
    ]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
