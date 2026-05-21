import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import LogoutButton from "../components/common/LogoutButton";

import NotificationModal from "../components/notification/NotificationModal";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    deleteAllNotifications
} from "../api/notificationApi";

const TopNavbar = () => {

    const navigate = useNavigate();

    const { user } = useAuth();

    const modalRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);

    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [seenNotifications, setSeenNotifications] = useState([]);

    const [unseenNotifications, setUnseenNotifications] = useState([]);

    // FETCH NOTIFICATIONS
    const fetchNotifications = async () => {

        try {

            setLoadingNotifications(true);

            const data =
                await getNotifications();

            setNotifications(
                data.payload?.allNotifications || []
            );

            setSeenNotifications(
                data.payload?.seenNotifications || []
            );

            setUnseenNotifications(
                data.payload?.unseenNotifications || []
            );

        }
        catch (err) {

            console.log(err);
        }
        finally {

            setLoadingNotifications(false);
        }
    };

    useEffect(() => {

        fetchNotifications();

    }, []);

    // CLOSE MODAL ON OUTSIDE CLICK
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                modalRef.current &&
                !modalRef.current.contains(e.target)
            ) {

                setShowNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    // MARK SINGLE AS READ
    const handleMarkRead = async (
        notificationId
    ) => {

        try {

            await markNotificationRead(
                notificationId
            );

            fetchNotifications();

        }
        catch (err) {

            console.log(err);
        }
    };

    // MARK ALL AS READ
    const handleMarkAllRead = async () => {

        try {

            await markAllNotificationsRead();

            fetchNotifications();

        }
        catch (err) {

            console.log(err);
        }
    };

    // DELETE SINGLE
    const handleDeleteNotification = async (
        notificationId
    ) => {

        try {

            await deleteNotification(
                notificationId
            );

            fetchNotifications();

        }
        catch (err) {

            console.log(err);
        }
    };

    // DELETE ALL
    const handleDeleteAllNotifications = async () => {

        try {

            await deleteAllNotifications();

            fetchNotifications();

        }
        catch (err) {

            console.log(err);
        }
    };

    return (

        <div className="h-[72px] border-b border-gray-800 px-8 flex items-center justify-between bg-[#0d1117]">

            {/* Left */}
            <div>

                <h1 className="text-xl font-semibold">
                    Collaborative Development Platform
                </h1>

            </div>

            {/* Right */}
            <div className="flex items-center gap-5">

                {/* Notifications */}
                <div
                    className="relative"
                    ref={modalRef}
                >

                    <button
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                        className="relative w-11 h-11 rounded-full bg-[#161b22] hover:bg-[#1f2937] transition flex items-center justify-center text-xl"
                    >

                        🔔

                        {
                            unseenNotifications.length > 0 && (

                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )
                        }

                    </button>

                    {
                        showNotifications && (

                            <NotificationModal
                                notifications={notifications}
                                loading={loadingNotifications}
                                onMarkRead={handleMarkRead}
                                onMarkAllRead={handleMarkAllRead}
                                onDelete={handleDeleteNotification}
                                onDeleteAll={handleDeleteAllNotifications}
                                onClose={() =>
                                    setShowNotifications(false)
                                }
                            />
                        )
                    }

                </div>

                {/* Profile */}
                <div
                    onClick={() =>
                        navigate("/profile")
                    }
                    className="flex items-center gap-3 bg-[#161b22] px-4 py-2 rounded-xl cursor-pointer hover:border hover:border-blue-500 transition"
                >

                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-black font-bold overflow-hidden">

                        {
                            user?.userProfile
                                ? (
                                    <img
                                        src={
                                            user.userProfile
                                        }
                                        alt={
                                            user.name
                                        }
                                        className="w-full h-full object-cover"
                                    />
                                )
                                : (
                                    user?.name
                                        ?.charAt(0)
                                        .toUpperCase()
                                )
                        }

                    </div>

                    <div>

                        <p className="font-medium">
                            {user?.name}
                        </p>

                        <p className="text-sm text-gray-400">
                            {user?.email}
                        </p>

                    </div>

                </div>

                {/* Logout */}
                <LogoutButton />

            </div>

        </div>
    );
};

export default TopNavbar;