import { useNavigate } from "react-router-dom";

import Loader from "../common/Loader";

const NotificationModal = ({
    notifications,
    loading,
    onMarkAllRead,
    onDelete,
    onDeleteAll,
    onClose
}) => {

    const navigate = useNavigate();

    const handleOpenNotification = (
        notificationId
    ) => {

        navigate(
            `/notification/${notificationId}`
        );

        onClose();
    };

    return (

        <div className="absolute top-20 right-0 w-[430px] bg-[#161b22] border border-gray-800 rounded-3xl shadow-2xl z-50 overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">

                <div>

                    <h2 className="text-2xl font-bold">
                        Notifications
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                        Recent activities
                    </p>

                </div>

                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center p-3 px-6 border-b border-gray-800 bg-[#0d1117]/50">
                <button
                    onClick={onMarkAllRead}
                    className="text-sm text-blue-400 hover:text-blue-300 transition font-medium"
                >
                    ✓ Mark all as read
                </button>
                <button
                    onClick={onDeleteAll}
                    className="text-sm text-gray-500 hover:text-red-400 transition font-medium"
                >
                    Clear all
                </button>
            </div>

            {/* CONTENT */}
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">

                {
                    loading
                        ? (
                            <div className="p-8">

                                <Loader text="Loading notifications..." />

                            </div>
                        )
                        : notifications.length === 0
                            ? (
                                <div className="p-10 text-center">

                                    <h3 className="text-2xl font-bold mb-3">

                                        No Notifications

                                    </h3>

                                    <p className="text-gray-400">

                                        You're all caught up.

                                    </p>

                                </div>
                            )
                            : (

                                <div className="divide-y divide-gray-800">

                                    {
                                        notifications.map((notification) => (

                                            <div
                                                key={notification._id}
                                                className={`p-5 transition cursor-pointer hover:bg-[#0d1117] ${!notification.isRead
                                                        ? "bg-blue-500/5"
                                                        : ""
                                                    }`}
                                                onClick={() =>
                                                    handleOpenNotification(
                                                        notification._id
                                                    )
                                                }
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex-1">

                                                        <p className="text-white leading-7">

                                                            {
                                                                notification.message
                                                            }

                                                        </p>

                                                        <p className="text-gray-500 text-sm mt-3">

                                                            {
                                                                new Date(
                                                                    notification.createdAt
                                                                ).toLocaleString()
                                                            }

                                                        </p>

                                                    </div>

                                                    <button
                                                        onClick={(e) => {

                                                            e.stopPropagation();

                                                            onDelete(
                                                                notification._id
                                                            );
                                                        }}
                                                        className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 transition text-black text-sm font-semibold"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>
                                        ))
                                    }

                                </div>
                            )
                }

            </div>

        </div>
    );
};

export default NotificationModal;