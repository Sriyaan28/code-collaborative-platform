import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import RepositoryTabs from "../components/repository/RepositoryTabs";
import Loader from "../components/common/Loader";
import { getAllPullRequests } from "../api/prApi";
import { getBranches } from "../api/branchApi";
import CreatePRModal from "../components/pr/CreatePRModal";
import useModal from "../hooks/useModal";

const PullRequestsPage = () => {
    const { repoId } = useParams();
    const { showModal } = useModal();
    
    const [loading, setLoading] = useState(true);
    const [pullRequests, setPullRequests] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prRes, branchRes] = await Promise.all([
                getAllPullRequests(repoId),
                getBranches(repoId)
            ]);
            
            const payload = prRes.payload || {};
            setPullRequests([
                ...(payload.openPullRequests || []),
                ...(payload.mergedPullRequests || []),
                ...(payload.closedPullRequests || [])
            ]);
            setBranches(branchRes.payload || []);
        } catch (err) {
            showModal("Failed to fetch pull requests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [repoId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'opened': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'merged': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'closed': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading pull requests..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                
                {/* Back Button */}
                <div className="mb-4">
                    <Link 
                        to={`/repository/${repoId}`}
                        className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm w-fit"
                    >
                        <span>←</span> Back to Repository Overview
                    </Link>
                </div>

                <RepositoryTabs repoId={repoId} />

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
                onPRCreated={fetchData}
                repository={repoId}
                branches={branches}
            />

        </DashboardLayout>
    );
};

export default PullRequestsPage;
