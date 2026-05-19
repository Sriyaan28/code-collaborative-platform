import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import {
    getNotificationById,
    markNotificationRead
} from "../api/notificationApi";

const NotificationPage = () => {

    const { notificationId } = useParams();

    const navigate = useNavigate();

    const [notification, setNotification] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchNotification = async () => {

            try {

                const data =
                    await getNotificationById(
                        notificationId
                    );

                const notificationData =
                    data.payload;

                setNotification(
                    notificationData
                );

                // AUTO MARK READ
                if (
                    !notificationData.isRead
                ) {

                    await markNotificationRead(
                        notificationId
                    );
                }

            }
            catch (err) {

                console.log(err);
            }
            finally {

                setLoading(false);
            }
        };

        fetchNotification();

    }, [notificationId]);

    const handleReferenceRedirect = () => {

        console.log(notification);

        if (!notification) return;

        const {
            reference_type,
            reference_id
        } = notification;

        switch (reference_type) {

            // USER
            case "USER":

                navigate(
                    `/profile/${reference_id}`
                );

                break;

            // REPOSITORY
            case "REPOSITORY":

                navigate(
                    `/repository/${reference_id}`
                );

                break;

            // FILE
            case "FILE":

                navigate(
                    `/file/${reference_id}`
                );

                break;

            // BRANCH
            case "BRANCH":

                navigate(
                    `/branch/${reference_id}`
                );

                break;

            // COLLABORATOR
            case "COLLABORATOR":

                navigate(
                    `/collaborator/${reference_id}`
                );

                break;

            // ISSUE
            case "ISSUE":

                navigate(
                    `/issue/${reference_id}`
                );

                break;

            // PULL REQUEST
            case "PULL_REQUEST":

                navigate(
                    `/pull-request/${reference_id}`
                );

                break;

            // COMMENT
            case "COMMENT":

                navigate(
                    `/comment/${reference_id}`
                );

                break;

            default:

                alert(
                    "No redirect available"
                );
        }
    };

    if (loading) {

        return (

            <DashboardLayout>

                <Loader text="Loading notification..." />

            </DashboardLayout>
        );
    }

    if (!notification) {

        return (

            <DashboardLayout>

                <p className="text-gray-500">
                    Notification not found
                </p>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="max-w-4xl">

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-10">

                    <h1 className="text-4xl font-bold mb-6">
                        Notification
                    </h1>

                    <p className="text-xl text-white leading-9">

                        {
                            notification.message
                        }

                    </p>

                    <p className="text-gray-500 mt-6">

                        {
                            new Date(
                                notification.createdAt
                            ).toLocaleString()
                        }

                    </p>

                    <div className="mt-10">

                        <button
                            onClick={
                                handleReferenceRedirect
                            }
                            className="px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                        >
                            Open Reference
                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default NotificationPage;