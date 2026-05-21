import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import RepositoryTabs from "../components/repository/RepositoryTabs";
import Loader from "../components/common/Loader";
import { getAllIssues } from "../api/issueApi";
import CreateIssueModal from "../components/issue/CreateIssueModal";
import useModal from "../hooks/useModal";

const IssuesPage = () => {
    const { repoId } = useParams();
    const { showModal } = useModal();
    
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState("all"); // all, open, closed

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const res = await getAllIssues(repoId);
            setIssues(res.payload?.issues || []);
        } catch (err) {
            showModal("Failed to fetch issues", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [repoId]);

    const getStatusColor = (status) => {
        return status === 'open' 
            ? 'text-green-400 bg-green-400/10 border-green-400/20' 
            : 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    };

    const filteredIssues = issues.filter(issue => {
        if (filter === "all") return true;
        return issue.status === filter;
    });

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading issues..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                
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
                        <h1 className="text-3xl font-bold mb-2">Issues</h1>
                        <p className="text-gray-400">
                            Track bugs, features, and tasks
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <span>+</span> New Issue
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === "all" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
                    >
                        All Issues
                    </button>
                    <button 
                        onClick={() => setFilter("open")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${filter === "open" ? "bg-green-500/10 text-green-400" : "text-gray-400 hover:text-green-400 hover:bg-green-500/5"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-green-400"></span> Open
                    </button>
                    <button 
                        onClick={() => setFilter("closed")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${filter === "closed" ? "bg-purple-500/10 text-purple-400" : "text-gray-400 hover:text-purple-400 hover:bg-purple-500/5"}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span> Closed
                    </button>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden">
                    {filteredIssues.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold mb-2">No Issues Found</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                {filter === "all" ? "There are no issues in this repository yet. Create one to start tracking work!" : `No ${filter} issues found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {filteredIssues.map(issue => (
                                <Link 
                                    key={issue._id}
                                    to={`/repository/${repoId}/issue/${issue._id}`}
                                    className="p-6 hover:bg-[#1f2937] transition flex items-start justify-between group block"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition">
                                                {issue.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                                                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                                            {issue.description}
                                        </p>
                                        <div className="text-gray-500 text-xs">
                                            #{issue._id.substring(issue._id.length - 6)} opened by <span className="font-medium text-gray-400">{issue.createdBy?.name || "Unknown"}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Assignees Avatars */}
                                    {issue.assignees?.length > 0 && (
                                        <div className="flex -space-x-2 shrink-0">
                                            {issue.assignees.slice(0, 3).map((assignee, idx) => (
                                                <img 
                                                    key={assignee._id || idx} 
                                                    src={assignee.userProfile} 
                                                    title={assignee.name}
                                                    alt={assignee.name} 
                                                    className="w-8 h-8 rounded-full border-2 border-[#161b22] object-cover bg-gray-800"
                                                />
                                            ))}
                                            {issue.assignees.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-[#161b22] bg-gray-800 flex items-center justify-center text-xs font-medium text-white">
                                                    +{issue.assignees.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreateIssueModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onIssueCreated={fetchIssues}
                repoId={repoId}
            />

        </DashboardLayout>
    );
};

export default IssuesPage;
