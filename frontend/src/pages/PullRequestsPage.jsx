import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import CreatePRModal from "../components/pr/CreatePRModal";
import usePullRequest from "../hooks/usePullRequest";

const PullRequestsPage = () => {
    const { repoId } = useParams();
    const { pullRequests, branches, loading, fetchPullRequests } = usePullRequest();
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchPullRequests();
    }, [fetchPullRequests]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'opened': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'merged': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'closed': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) {
        return <Loader text="Loading pull requests..." />;
    }

    return (
        <div>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Pull Requests</h1>
                        <p className="text-gray-400">
                            Manage code contributions and merges
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <span>+</span> New Pull Request
                    </button>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden">
                    {pullRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4">🔄</div>
                            <h3 className="text-xl font-bold mb-2">No Pull Requests Yet</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                There are no pull requests in this repository. Create one to start merging code!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {pullRequests.map(pr => (
                                <Link 
                                    key={pr._id}
                                    to={`/repository/${repoId}/pull-request/${pr._id}`}
                                    className="p-6 hover:bg-[#1f2937] transition flex items-start justify-between group block"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition">
                                                {pr.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pr.status)}`}>
                                                {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3">
                                            #{pr._id.substring(pr._id.length - 6)} opened by {pr.createdBy?.name || "Unknown"}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                                            <span className="bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
                                                {pr.sourceBranch?.name || "Unknown"}
                                            </span>
                                            <span>→</span>
                                            <span className="bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
                                                {pr.targetBranch?.name || "Unknown"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        {new Date(pr.createdAt).toLocaleDateString()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreatePRModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPRCreated={fetchPullRequests}
                repository={repoId}
                branches={branches}
            />

        </div>
    );
};

export default PullRequestsPage;
