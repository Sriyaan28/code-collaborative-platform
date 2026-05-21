import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import Loader from "../components/common/Loader";

import CollaboratorCard from "../components/collaborator/CollaboratorCard";

import AddCollaboratorModal from "../components/collaborator/AddCollaboratorModal";

import {
    getCollaborators,
    removeCollaborator
} from "../api/collaboratorApi";

import useModal from "../hooks/useModal";

const CollaboratorsPage = () => {

    const { repoId } = useParams();
    const { showModal } = useModal();

    const [collaborators, setCollaborators] = useState([]);

    const [blockedUsers, setBlockedUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("collaborators");

    // FETCH COLLABORATORS
    const fetchCollaborators = async () => {

        try {

            setLoading(true);

            const data =
                await getCollaborators(
                    repoId
                );

            console.log(data);

            setCollaborators(
                data.payload?.collaborators || []
            );

            setBlockedUsers(
                data.payload?.blockedUsers || []
            );

        }
        catch (err) {

            console.log(err);
        }
        finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchCollaborators();

    }, [repoId]);

    // REMOVE COLLABORATOR
    const handleRemove = async (
        collabId
    ) => {

        const confirmRemove =
            window.confirm(
                "Remove collaborator?"
            );

        if (!confirmRemove) return;

        try {

            const res = await removeCollaborator(
                collabId
            );

            showModal(res.message, "success");

            fetchCollaborators();

        }
        catch (err) {

            showModal(
                err.response?.data?.message ||
                "Failed to remove collaborator",
                "error"
            );
        }
    };

    return (
        <div>

            {/* Header */}
            <div className="flex items-center justify-between mb-10">

                <div>

                    <h1 className="text-4xl font-bold">
                        Collaborators
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Manage repository collaborators and blocked users
                    </p>

                </div>

                <button
                    onClick={() =>
                        setIsAddModalOpen(true)
                    }
                    className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                >
                    + Add Collaborator
                </button>

            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-10">

                <button
                    onClick={() =>
                        setActiveTab(
                            "collaborators"
                        )
                    }
                    className={`px-6 py-3 rounded-2xl transition font-semibold ${activeTab === "collaborators"
                        ? "bg-blue-500 text-black"
                        : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Collaborators
                </button>

                <button
                    onClick={() =>
                        setActiveTab(
                            "blocked"
                        )
                    }
                    className={`px-6 py-3 rounded-2xl transition font-semibold ${activeTab === "blocked"
                        ? "bg-red-500 text-black"
                        : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Blocked Users
                </button>

            </div>

            {/* CONTENT */}
            {
                loading
                    ? (
                        <Loader text="Loading collaborators..." />
                    )
                    : activeTab === "collaborators"
                        ? (
                            collaborators.length === 0
                                ? (
                                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-10 text-center">

                                        <h2 className="text-3xl font-bold mb-4">

                                            No Collaborators

                                        </h2>

                                        <p className="text-gray-400 mb-8">

                                            Add collaborators to work together on this repository.

                                        </p>

                                        <button
                                            onClick={() =>
                                                setIsAddModalOpen(true)
                                            }
                                            className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                                        >
                                            Add Collaborator
                                        </button>

                                    </div>
                                )
                                : (
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                        {
                                            collaborators.map((collaborator) => (

                                                <CollaboratorCard
                                                    key={collaborator._id}
                                                    collaborator={collaborator}
                                                    onRemove={handleRemove}
                                                />
                                            ))
                                        }

                                    </div>
                                )
                        )
                        : (
                            blockedUsers.length === 0
                                ? (
                                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-10 text-center">

                                        <h2 className="text-3xl font-bold mb-4">

                                            No Blocked Users

                                        </h2>

                                        <p className="text-gray-400">

                                            No users are currently blocked from this repository.

                                        </p>

                                    </div>
                                )
                                : (
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                        {
                                            blockedUsers.map((blockedUser) => (

                                                <div
                                                    key={blockedUser._id}
                                                    className="bg-[#161b22] border border-red-500/30 rounded-3xl p-6"
                                                >

                                                    <h2 className="text-2xl font-semibold text-red-400">

                                                        {
                                                            blockedUser.user?.name ||
                                                            "Unknown User"
                                                        }

                                                    </h2>

                                                    <p className="text-gray-400 mt-2">

                                                        {
                                                            blockedUser.user?.email
                                                        }

                                                    </p>

                                                    <div className="mt-5">

                                                        <span className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-sm text-red-400">

                                                            BLOCKED

                                                        </span>

                                                    </div>

                                                </div>
                                            ))
                                        }

                                    </div>
                                )
                        )
            }

            {/* ADD MODAL */}
            <AddCollaboratorModal
                isOpen={isAddModalOpen}
                onClose={() =>
                    setIsAddModalOpen(false)
                }
                onCollaboratorAdded={
                    fetchCollaborators
                }
                repoId={repoId}
            />

        </div>
    );
};

export default CollaboratorsPage;