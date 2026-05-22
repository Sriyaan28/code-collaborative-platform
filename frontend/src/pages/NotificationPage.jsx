import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import useModal from "../hooks/useModal";
import useNotification from "../hooks/useNotification";

const NotificationPage = () => {
    const { notificationId } = useParams();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const { notification, loadingNotification, fetchNotification } = useNotification();

    useEffect(() => {
        if (notificationId) {
            fetchNotification(notificationId);
        }
    }, [notificationId, fetchNotification]);

    const handleReferenceRedirect = () => {


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

                showModal(
                    "No redirect available",
                    "error"
                );
        }
    };

    if (loadingNotification) {

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