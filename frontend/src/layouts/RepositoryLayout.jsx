import { Outlet, Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import RepositoryTabs from "../components/repository/RepositoryTabs";
import Loader from "../components/common/Loader";
import useRepository from "../hooks/useRepository";

const RepositoryLayout = () => {
    const { repoId, repository, loading, deleting, handleDeleteRepo } = useRepository();

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
                <div className="max-w-5xl mx-auto text-center mt-20">
                    <h2 className="text-2xl font-bold text-gray-300">Repository not found</h2>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto w-full pb-20">
                {/* Repository Header */}
                <div className="mb-10">
                    <Link
                        to="/repositories"
                        className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 mb-6 w-max"
                    >
                        &larr; Back to Repositories
                    </Link>

                    <div className="flex items-center justify-between flex-wrap gap-5">
                        <div className="flex items-center gap-5 flex-wrap">
                            <h1 className="text-5xl font-bold text-blue-400">
                                {repository.name}
                            </h1>
                            <span className="px-4 py-2 rounded-full bg-[#161b22] border border-gray-700 text-sm">
                                {repository.visibility}
                            </span>
                        </div>

                        {/* Delete button moved to Settings Tab */}
                    </div>
                    <p className="text-gray-400 mt-6 text-lg leading-8 max-w-4xl">
                        {repository.description || "No description"}
                    </p>
                </div>

                {/* Shared Tabs */}
                <RepositoryTabs repoId={repoId} repository={repository} />

                {/* Sub-page Content */}
                <div className="mt-8">
                    <Outlet context={{ repository }} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RepositoryLayout;
