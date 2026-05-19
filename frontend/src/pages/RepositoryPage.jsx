import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import RepositoryTabs from "../components/repository/RepositoryTabs";

import {
    getRepositoryById
} from "../api/repositoryApi";

const RepositoryPage = () => {

    const { repoId } = useParams();

    const [repository, setRepository] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRepository = async () => {

            try {

                const data =
                    await getRepositoryById(
                        repoId
                    );

                setRepository(
                    data.payload
                );

            }
            catch (err) {

                console.log(err);
            }
            finally {

                setLoading(false);
            }
        };

        fetchRepository();

    }, [repoId]);

    if (loading) {

        return (

            <DashboardLayout>

                <Loader text="Loading repository..." />

            </DashboardLayout>
        );
    }

    if (!repository) {

        return (

            <DashboardLayout>

                <p className="text-gray-500">
                    Repository not found
                </p>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            {/* Header */}
            <div className="mb-10">

                <div className="flex items-center gap-5 flex-wrap">

                    <h1 className="text-5xl font-bold text-blue-400">

                        {repository.name}

                    </h1>

                    <span className="px-4 py-2 rounded-full bg-[#161b22] border border-gray-700 text-sm">

                        {repository.visibility}

                    </span>

                </div>

                <p className="text-gray-400 mt-6 text-lg leading-8 max-w-4xl">

                    {
                        repository.description ||
                        "No description"
                    }

                </p>

            </div>

            {/* Tabs */}
            <RepositoryTabs
                repoId={repoId}
            />

            {/* Overview */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">

                    <h2 className="text-2xl font-semibold mb-5">
                        Repository Info
                    </h2>

                    <div className="space-y-4 text-gray-400">

                        <p>

                            <span className="text-white">
                                Repository ID:
                            </span>

                            {" "}
                            {repository._id}

                        </p>

                        <p>

                            <span className="text-white">
                                Visibility:
                            </span>

                            {" "}
                            {repository.visibility}

                        </p>

                    </div>

                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">

                    <h2 className="text-2xl font-semibold mb-5">
                        Future Features
                    </h2>

                    <div className="space-y-3 text-gray-400">

                        <p>• Collaborators</p>

                        <p>• Pull Requests</p>

                        <p>• Commits</p>

                        <p>• Discussions</p>

                        <p>• Repository Settings</p>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default RepositoryPage;