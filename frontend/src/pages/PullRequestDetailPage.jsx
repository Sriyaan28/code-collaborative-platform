import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import usePullRequest from "../hooks/usePullRequest";

const PullRequestDetailPage = () => {
    const { repoId, prId } = useParams();
    const { user } = useAuth();
    
    const { 
        pr, loading, actionLoading, errorMsg, 
        fetchPR, handleUpdateStatus, handleDelete 
    } = usePullRequest();

    useEffect(() => {
        if (prId) {
            fetchPR(prId);
        }
    }, [prId, fetchPR]);

    const onUpdateStatus = (status) => {
        handleUpdateStatus(prId, status);
    };

    const onDelete = () => {
        const confirm = window.confirm("Are you sure you want to permanently delete this pull request?");
        if (confirm) {
            handleDelete(prId);
        }
    };

    if (loading) {
        return <Loader text="Loading pull request details..." />;
    }

    if (errorMsg || !pr) {
        return (
            <div className="max-w-4xl mx-auto text-center mt-20">
                <h2 className="text-2xl font-bold text-gray-300">{errorMsg || "Pull Request Not Found"}</h2>
                <Link to={`/repository/${repoId}/pull-requests`} className="text-blue-500 hover:underline mt-4 inline-block">
                    Back to Pull Requests
                </Link>
            </div>
        );
    }

    const isAuthor = user?.id === pr.createdBy?._id || user?._id === pr.createdBy?._id;
    // Assuming repo owner is not directly populated in PR, but typically owner or author can delete
    // For now we allow creator to delete.

    return (
        <div className="max-w-4xl mx-auto">
            
            {/* Back Button */}
            <div className="mb-6">
                <Link 
                    to={`/repository/${repoId}/pull-requests`}
                    className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm w-fit"
                >
                    <span>←</span> Back to Pull Requests
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-3 flex items-center gap-4">
                        {pr.title}
                        <span className="text-gray-500 font-normal">#{pr._id.substring(pr._id.length - 6)}</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className={`px-3 py-1 rounded-full font-medium border ${
                                pr.status === 'opened' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                pr.status === 'merged' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' :
                                'text-red-400 bg-red-400/10 border-red-400/20'
                            }`}>
                                {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                            </span>
                            <span className="text-gray-400">
                                <span className="text-white font-medium">{pr.createdBy?.name || "Unknown"}</span> opened this pull request on {new Date(pr.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {pr.status === 'opened' && (
                            <>
                                <button
                                    onClick={() => onUpdateStatus('merged')}
                                    disabled={actionLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    ✓ Merge PR
                                </button>
                                <button
                                    onClick={() => onUpdateStatus('closed')}
                                    disabled={actionLoading}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium border border-gray-700 transition disabled:opacity-50"
                                >
                                    Close PR
                                </button>
                            </>
                        )}
                        {isAuthor && (
                            <button
                                onClick={onDelete}
                                disabled={actionLoading}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Branches */}
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 mb-6 flex items-center gap-4 text-sm font-mono">
                    <span className="text-gray-400">Merging from</span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg">
                        {pr.sourceBranch?.name || "Unknown"}
                    </span>
                    <span className="text-gray-500">into</span>
                    <span className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-lg">
                        {pr.targetBranch?.name || "Unknown"}
                    </span>
                </div>

                {/* Description */}
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-[#0f141b]/50">
                        <h3 className="font-semibold text-gray-300">Description</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {pr.description || <span className="text-gray-500 italic">No description provided.</span>}
                        </p>
                    </div>
                </div>

                {pr.status !== 'opened' && (
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        This pull request was {pr.status} 
                        {pr.status === 'merged' && pr.mergedBy && ` by ${pr.mergedBy.name || 'Unknown'}`} 
                        {' '}on {new Date(pr.status === 'merged' ? pr.mergedAt : pr.closedAt).toLocaleDateString()}
                    </div>
                )}

        </div>
    );
};

export default PullRequestDetailPage;
