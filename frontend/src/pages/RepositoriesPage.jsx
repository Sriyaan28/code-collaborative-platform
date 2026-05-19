import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import RepositoryCard from "../components/repository/RepositoryCard";

import CreateRepositoryModal from "../components/repository/CreateRepositoryModal";

import {
    getRepositories
} from "../api/repositoryApi";

const RepositoriesPage = () => {

    const [repositories, setRepositories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchRepositories = async () => {

        try {

            setLoading(true);

            const data =
                await getRepositories();

            // ONLY USER REPOSITORIES
            setRepositories(
                data.payload?.userRepositories || []
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

        fetchRepositories();

    }, []);

    return (

        <DashboardLayout>

            {/* Header */}
            <div className="flex items-center justify-between mb-10">

                <div>

                    <h1 className="text-4xl font-bold">
                        Repositories
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Manage your repositories
                    </p>

                </div>

                <button
                    onClick={() =>
                        setShowCreateModal(true)
                    }
                    className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                >
                    + Create Repository
                </button>

            </div>

            {/* Repository List */}
            {
                loading
                    ? (
                        <Loader text="Loading repositories..." />
                    )
                    : repositories.length === 0
                        ? (
                            <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-10 text-center">

                                <h2 className="text-3xl font-bold mb-4">
                                    No Repositories Yet
                                </h2>

                                <p className="text-gray-400 mb-8">
                                    Create your first repository to start collaborating.
                                </p>

                                <button
                                    onClick={() =>
                                        setShowCreateModal(true)
                                    }
                                    className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                                >
                                    Create Repository
                                </button>

                            </div>
                        )
                        : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {
                                    repositories.map((repository) => (

                                        <RepositoryCard
                                            key={repository._id}
                                            repository={repository}
                                        />
                                    ))
                                }

                            </div>
                        )
            }

            {/* Create Repository Modal */}
            <CreateRepositoryModal
                isOpen={showCreateModal}
                onClose={() =>
                    setShowCreateModal(false)
                }
                onRepositoryCreated={
                    fetchRepositories
                }
            />

        </DashboardLayout>
    );
};

export default RepositoriesPage;