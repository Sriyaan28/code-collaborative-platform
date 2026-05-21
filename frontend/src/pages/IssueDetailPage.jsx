import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getIssueById, updateIssueStatus, deleteIssue } from "../api/issueApi";
import useModal from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";

const IssueDetailPage = () => {
    const { repoId, issueId } = useParams();
    const { showModal } = useModal();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [issue, setIssue] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const fetchIssue = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const res = await getIssueById(issueId);
            setIssue(res.payload?.issue || res.payload);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch issue details";
            setErrorMsg(msg);
            showModal(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssue();
    }, [issueId]);

    const handleUpdateStatus = async (status) => {
        try {
            setActionLoading(true);
            const res = await updateIssueStatus(issueId, status);
            showModal(res.message, "success");
            fetchIssue();
        } catch (err) {
            showModal(err.response?.data?.message || `Failed to ${status} issue`, "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to permanently delete this issue?");
        if (!confirm) return;

        try {
            setActionLoading(true);
            const res = await deleteIssue(issueId);
            showModal(res.message, "success");
            navigate(`/repository/${repoId}/issues`);
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete issue", "error");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <Loader text="Loading issue details..." />;
    }

    if (errorMsg || !issue) {
        return (
            <div className="max-w-4xl mx-auto text-center mt-20">
                <h2 className="text-2xl font-bold text-gray-300">{errorMsg || "Issue Not Found"}</h2>
                <Link to={`/repository/${repoId}/issues`} className="text-blue-500 hover:underline mt-4 inline-block">
                    Back to Issues
                </Link>
            </div>
        );
    }

    const currentUserId = user?.id || user?._id;
    const isAuthor = currentUserId === issue.createdBy?._id || currentUserId === issue.createdBy;
    const isAssignee = issue.assignees?.some(a => a._id === currentUserId || a === currentUserId);
    const isOwner = issue.repository?.owner === currentUserId; // simplified check
    
    // permissions
    const canUpdate = isAuthor || isAssignee || isOwner;
    const canDelete = isOwner; // backend says only owner can delete

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link 
                    to={`/repository/${repoId}/issues`}
                    className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm w-fit"
                >
                    <span>←</span> Back to Issues
                </Link>
            </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-3 flex items-center gap-4">
                            {issue.title}
                            <span className="text-gray-500 font-normal">#{issue._id.substring(issue._id.length - 6)}</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className={`px-3 py-1 rounded-full font-medium border ${
                                issue.status === 'open' 
                                    ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                                    : 'text-purple-400 bg-purple-400/10 border-purple-400/20'
                            }`}>
                                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                            </span>
                            <span className="text-gray-400">
                                <span className="text-white font-medium">{issue.createdBy?.name || "Unknown"}</span> opened this issue on {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {canUpdate && issue.status === 'open' && (
                            <button
                                onClick={() => handleUpdateStatus('closed')}
                                disabled={actionLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                            >
                                Close Issue
                            </button>
                        )}
                        {canUpdate && issue.status === 'closed' && (
                            <button
                                onClick={() => handleUpdateStatus('open')}
                                disabled={actionLoading}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium border border-gray-700 transition disabled:opacity-50"
                            >
                                Reopen Issue
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden">
                            <div className="p-4 border-b border-gray-800 bg-[#0f141b]/50">
                                <h3 className="font-semibold text-gray-300">Description</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {issue.description || <span className="text-gray-500 italic">No description provided.</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">
                            <h3 className="font-semibold text-gray-300 mb-4 pb-4 border-b border-gray-800">Assignees</h3>
                            {issue.assignees?.length > 0 ? (
                                <div className="space-y-3">
                                    {issue.assignees.map(assignee => (
                                        <div key={assignee._id} className="flex items-center gap-3">
                                            <img src={assignee.userProfile} alt={assignee.name} className="w-8 h-8 rounded-full bg-gray-800 object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-300">{assignee.name}</p>
                                                <p className="text-xs text-gray-500">{assignee.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No one assigned</p>
                            )}
                        </div>
                    </div>
                </div>

        </div>
    );
};

export default IssueDetailPage;
