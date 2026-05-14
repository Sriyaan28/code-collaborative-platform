import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { useAuth } from "../hooks/useAuth";

import { getRepositories } from "../api/repositoryApi";

import Loader from "../components/common/Loader";

import RepositoryCard from "../components/repository/RepositoryCard";

const DashboardPage = () => {

    const { user } = useAuth();

    const [userRepositories, setUserRepositories] = useState([]);

    const [publicRepositories, setPublicRepositories] = useState([]);

    const [activeTab, setActiveTab] = useState("public");

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRepositories = async () => {

            try {

                const data = await getRepositories();

                setUserRepositories(
                    data.payload.userRepositories || []
                );

                setPublicRepositories(
                    data.payload.publicRepositories || []
                );

            }
            catch (err) {

                console.log(err);
            }
            finally {

                setLoading(false);
            }
        };

        fetchRepositories();

    }, []);

    const repositories =
        activeTab === "public"
            ? publicRepositories
            : userRepositories;

    return (

        <DashboardLayout>

            {/* Header */}
            <div>

                <h1 className="text-4xl font-bold">
                    Dashboard
                </h1>

                <p className="mt-3 text-gray-400">
                    Welcome back, {user?.name}
                </p>

            </div>

            {/* Divider */}
            <div className="border-b border-gray-800 mt-8 mb-8"></div>

            {/* Tabs */}
            <div className="flex items-center gap-4 mb-10">

                <button
                    onClick={() => setActiveTab("public")}
                    className={`px-6 py-3 rounded-xl transition font-medium ${activeTab === "public"
                        ? "bg-blue-500 text-black"
                        : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Public Repositories
                </button>

                <button
                    onClick={() => setActiveTab("user")}
                    className={`px-6 py-3 rounded-xl transition font-medium ${activeTab === "user"
                        ? "bg-blue-500 text-black"
                        : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Your Repositories
                </button>

            </div>

            {/* Content */}
            {
                loading
                    ? (
                        <Loader text="Loading repositories..." />
                    )
                    : repositories.length === 0
                        ? (
                            <p className="text-gray-500">
                                No repositories found
                            </p>
                        )
                        : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {
                                    repositories.map((repo) => (
                                        <RepositoryCard
                                            key={repo._id}
                                            repository={repo}
                                        />
                                    ))
                                }

                            </div>
                        )
            }

        </DashboardLayout>
    );
};

export default DashboardPage;