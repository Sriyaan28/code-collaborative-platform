import { Outlet } from "react-router-dom";
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
                    <div className="flex items-center justify-between flex-wrap gap-5">
                        <div className="flex items-center gap-5 flex-wrap">
                            <h1 className="text-5xl font-bold text-blue-400">
                                {repository.name}
                            </h1>
                            <span className="px-4 py-2 rounded-full bg-[#161b22] border border-gray-700 text-sm">
                                {repository.visibility}
                            </span>
                        </div>

                        {repository.currentUserRole === 'owner' && (
                            <button
                                onClick={handleDeleteRepo}
                                disabled={deleting}
                                className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition flex items-center gap-2 font-medium"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                                {deleting ? "Deleting..." : "Delete Repository"}
                            </button>
                        )}
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
