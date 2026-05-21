import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { getAllDiscussions } from "../api/discussionApi";
import CreateDiscussionModal from "../components/discussion/CreateDiscussionModal";
import useModal from "../hooks/useModal";

const DiscussionsPage = () => {
    const { showModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [discussions, setDiscussions] = useState([]);
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const res = await getAllDiscussions(search);
            setDiscussions(res.payload || []);
        } catch (err) {
            showModal("Failed to fetch discussions", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchDiscussions();
        }, 500);
        return () => clearTimeout(debounce);
    }, [search]);

    const handleSuccess = () => {
        setIsCreateModalOpen(false);
        fetchDiscussions();
        showModal("Tech blog published successfully!", "success");
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-3">Discussions</h1>
                        <p className="text-gray-400">
                            Read and write tech blogs. Share your knowledge with the community.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition whitespace-nowrap shrink-0 shadow-lg shadow-blue-500/20"
                    >
                        Write a Blog
                    </button>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search blogs by title, content, or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#161b22] border border-gray-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition shadow-sm"
                    />
                </div>

                {/* List */}
                {loading && discussions.length === 0 ? (
                    <Loader text="Loading discussions..." />
                ) : discussions.length === 0 ? (
                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-12 text-center">
                        <div className="text-5xl mb-4">✍️</div>
                        <h3 className="text-xl font-bold mb-2">No Discussions Found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Be the first to start a conversation or share a tech blog!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {discussions.map(discussion => (
                            <Link
                                key={discussion._id}
                                to={`/discussion/${discussion._id}`}
                                className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition group block"
                            >
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <h2 className="text-2xl font-bold text-gray-200 group-hover:text-blue-400 transition line-clamp-2">
                                        {discussion.title}
                                    </h2>
                                    <span className="text-gray-500 text-sm whitespace-nowrap">
                                        {new Date(discussion.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                                    {discussion.content.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1')}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        {discussion.author?.userProfile ? (
                                            <img src={discussion.author.userProfile} alt="Author" className="w-8 h-8 rounded-full object-cover bg-gray-800" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                                                {discussion.author?.name?.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-300">
                                            {discussion.author?.name || "Unknown"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {discussion.tags?.length > 0 && (
                                            <div className="flex gap-2">
                                                {discussion.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-[#0d1117] border border-gray-800 rounded text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {discussion.tags.length > 3 && (
                                                    <span className="px-2 py-1 text-xs">+{discussion.tags.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            ❤️ {discussion.likes?.length || 0}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            💬 {discussion.comments?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CreateDiscussionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </DashboardLayout>
    );
};

export default DiscussionsPage;
