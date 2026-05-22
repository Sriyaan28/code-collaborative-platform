import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { getAssignedIssues } from "../api/issueApi";
import useModal from "../hooks/useModal";
import { useAppCache } from "../context/CacheContext";

const GlobalIssuesPage = () => {
    const { showModal } = useModal();
    const { getCache, setCache } = useAppCache();

    const cachedData = getCache("global_issues");
    const [loading, setLoading] = useState(!cachedData);
    const [issues, setIssues] = useState(cachedData || []);

    const fetchIssues = useCallback(async () => {
        try {
            if (!cachedData) setLoading(true);
            const res = await getAssignedIssues();
            const fetchedIssues = res.payload || [];
            setIssues(fetchedIssues);
            setCache("global_issues", fetchedIssues);
        } catch (err) {
            showModal("Failed to fetch assigned issues", "error");
        } finally {
            setLoading(false);
        }
    }, [cachedData, setCache, showModal]);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading assigned issues..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-3">Assigned Issues</h1>
                    <p className="text-gray-400">
                        View all open issues assigned to you across all repositories.
                    </p>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden">
                    {issues.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4">🎉</div>
                            <h3 className="text-xl font-bold mb-2">No Open Assigned Issues</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                You're all caught up! There are no open issues assigned to you at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {issues.map(issue => (
                                <Link 
                                    key={issue._id}
                                    to={`/repository/${issue.repository?._id}/issue/${issue._id}`}
                                    className="p-6 hover:bg-[#1f2937] transition flex items-start justify-between group block"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition">
                                                {issue.title}
                                            </h3>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium border text-green-400 bg-green-400/10 border-green-400/20">
                                                Open
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                                            {issue.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="text-gray-500">
                                                #{issue._id.substring(issue._id.length - 6)}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-mono">
                                                <span>repo:</span>
                                                <span className="font-semibold">{issue.repository?.name || 'Unknown'}</span>
                                            </span>
                                            <span className="text-gray-500">
                                                opened by <span className="font-medium text-gray-400">{issue.createdBy?.name || "Unknown"}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 text-sm shrink-0 whitespace-nowrap">
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GlobalIssuesPage;
