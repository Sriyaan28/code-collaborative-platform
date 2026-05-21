import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { getDiscussionById, toggleLikeDiscussion, addComment, deleteDiscussion, deleteComment } from "../api/discussionApi";
import { searchUsers } from "../api/userApi";
import useModal from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";

const DiscussionDetailPage = () => {
    const { id } = useParams();
    const { showModal } = useModal();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [discussion, setDiscussion] = useState(null);

    // Comment State
    const [commentInput, setCommentInput] = useState("");
    const [mentionQuery, setMentionQuery] = useState(null);
    const [mentionResults, setMentionResults] = useState([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [focusedMentionIndex, setFocusedMentionIndex] = useState(0);
    const textareaRef = useRef(null);

    const fetchDiscussion = async () => {
        try {
            setLoading(true);
            const res = await getDiscussionById(id);
            setDiscussion(res.payload);
        } catch (err) {
            showModal("Failed to fetch discussion details", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscussion();
    }, [id]);

    // Handle Mention Search
    useEffect(() => {
        const fetchUsers = async () => {
            if (mentionQuery === null) {
                setMentionResults([]);
                return;
            }
            if (mentionQuery.length === 0) {
                setMentionResults([]);
            }

            setIsSearchingUsers(true);
            try {
                if (mentionQuery.length > 0) {
                    const res = await searchUsers(mentionQuery, "email");
                    setMentionResults(res.payload || []);
                    setFocusedMentionIndex(0);
                }
            } catch (err) {
                console.error("Failed to search users", err);
            } finally {
                setIsSearchingUsers(false);
            }
        };

        const debounce = setTimeout(fetchUsers, 300);
        return () => clearTimeout(debounce);
    }, [mentionQuery]);

    // Detect @ typing in comment textarea
    const handleCommentChange = (e) => {
        const val = e.target.value;
        setCommentInput(val);

        const cursor = e.target.selectionStart;
        const textBeforeCursor = val.slice(0, cursor);
        const match = textBeforeCursor.match(/@(\w*)$/);

        if (match) {
            setMentionQuery(match[1]);
        } else {
            setMentionQuery(null);
        }
    };

    // Handle Keyboard Navigation
    const handleKeyDown = (e) => {
        if (mentionQuery !== null && mentionResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedMentionIndex(prev => (prev + 1) % mentionResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedMentionIndex(prev => (prev - 1 + mentionResults.length) % mentionResults.length);
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                insertMention(mentionResults[focusedMentionIndex]);
            } else if (e.key === 'Escape') {
                setMentionQuery(null);
            }
        }
    };

    // Insert Mention into Comment
    const insertMention = (mentionUser) => {
        const cursor = textareaRef.current.selectionStart;
        const textBeforeCursor = commentInput.slice(0, cursor);
        const textAfterCursor = commentInput.slice(cursor);

        const match = textBeforeCursor.match(/@(\w*)$/);
        if (match) {
            const startIdx = match.index;
            const newTextBefore = commentInput.slice(0, startIdx);

            const mentionText = `@[${mentionUser.name}](${mentionUser._id}) `;

            setCommentInput(newTextBefore + mentionText + textAfterCursor);
            setMentionQuery(null);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    const newPos = startIdx + mentionText.length;
                    textareaRef.current.setSelectionRange(newPos, newPos);
                }
            }, 0);
        }
    };

    const handleLike = async () => {
        try {
            const res = await toggleLikeDiscussion(id);
            setDiscussion(prev => ({ ...prev, likes: res.payload }));
        } catch (err) {
            showModal("Failed to like discussion", "error");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        try {
            setActionLoading(true);
            const res = await addComment(id, commentInput);
            setDiscussion(prev => ({ ...prev, comments: res.payload }));
            setCommentInput("");
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to add comment", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this tech blog?")) return;
        try {
            setActionLoading(true);
            await deleteDiscussion(id);
            showModal("Discussion deleted successfully", "success");
            navigate("/discussions");
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete discussion", "error");
            setActionLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            setActionLoading(true);
            const res = await deleteComment(id, commentId);
            setDiscussion(prev => ({ ...prev, comments: res.payload }));
            showModal("Comment deleted successfully", "success");
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete comment", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Helper to render content with custom @[Name](id) and #repository tags
    const renderContentWithTags = (text) => {
        if (!text) return null;

        // Split by lines to maintain paragraphs
        const lines = text.split('\n');

        return lines.map((line, lineIdx) => {
            // First parse the custom mention format: @[Name](id)
            const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
            let parts = [];
            let lastIdx = 0;
            let match;

            while ((match = mentionRegex.exec(line)) !== null) {
                // push text before match
                if (match.index > lastIdx) {
                    parts.push({ type: 'text', content: line.slice(lastIdx, match.index) });
                }
                // push match
                parts.push({ type: 'mention', name: match[1], id: match[2] });
                lastIdx = mentionRegex.lastIndex;
            }
            // push remaining text
            if (lastIdx < line.length) {
                parts.push({ type: 'text', content: line.slice(lastIdx) });
            }

            return (
                <p key={lineIdx} className="mb-4 min-h-[1.5rem]">
                    {parts.map((part, i) => {
                        if (part.type === 'mention') {
                            return (
                                <Link key={i} to={`/profile/${part.id}`} className="text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded transition">
                                    @{part.name}
                                </Link>
                            );
                        } else {
                            // Also parse old #repo if they just typed it raw
                            const textParts = part.content.split(/(?=[#])|(?<=[a-zA-Z0-9_]+)(?=\s|[.,!?]|$)/g);
                            return textParts.map((t, idx) => {
                                if (t.startsWith('#') && t.length > 1) {
                                    return <Link key={idx} to={`/search/repositories?q=${t.substring(1)}`} className="text-purple-400 hover:underline font-medium">{t}</Link>;
                                }
                                return <span key={idx}>{t}</span>;
                            });
                        }
                    })}
                </p>
            );
        });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading tech blog..." />
            </DashboardLayout>
        );
    }

    if (!discussion) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto text-center mt-20">
                    <h2 className="text-2xl font-bold text-gray-300">Discussion Not Found</h2>
                    <Link to="/discussions" className="text-blue-500 hover:underline mt-4 inline-block">
                        Back to Discussions
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const currentUserId = user?.id || user?._id;
    const isAuthor = currentUserId === discussion.author?._id;
    const hasLiked = discussion.likes?.includes(currentUserId);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-20">
                <div className="mb-8">
                    <Link
                        to="/discussions"
                        className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm w-fit"
                    >
                        <span>←</span> Back to Discussions
                    </Link>
                </div>

                {/* Article Header */}
                <div className="mb-10">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {discussion.title}
                        </h1>
                        {isAuthor && (
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50 shrink-0"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-y border-gray-800 py-6">
                        <div className="flex items-center gap-4">
                            {discussion.author?.userProfile ? (
                                <img src={discussion.author.userProfile} alt="Author" className="w-12 h-12 rounded-full object-cover bg-gray-800" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                                    {discussion.author?.name?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-200">{discussion.author?.name || "Unknown"}</p>
                                <p className="text-sm text-gray-500">
                                    Published on {new Date(discussion.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${hasLiked
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-[#161b22] border-gray-700 text-gray-400 hover:bg-gray-800'
                                }`}
                        >
                            <span>{hasLiked ? '❤️' : '🤍'}</span>
                            <span className="font-medium">{discussion.likes?.length || 0}</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-[#0d1117] rounded-3xl mb-12">
                    <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {renderContentWithTags(discussion.content)}
                    </div>

                    {discussion.tags?.length > 0 && (
                        <div className="mt-10 flex flex-wrap gap-2">
                            {discussion.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-[#161b22] border border-gray-800 rounded-lg text-sm text-gray-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Linked Repositories */}
                {discussion.linkedRepositories?.length > 0 && (
                    <div className="mb-12 border border-gray-800 rounded-3xl bg-[#161b22] p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>📁</span> Linked Repositories
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {discussion.linkedRepositories.map(repo => (
                                <Link
                                    key={repo._id}
                                    to={`/repository/${repo._id}`}
                                    className="block p-5 bg-[#0d1117] border border-gray-800 hover:border-gray-700 rounded-2xl transition group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-blue-400 group-hover:text-blue-300 transition text-lg truncate">
                                            {repo.name}
                                        </h4>
                                        <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700">
                                            {repo.visibility}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {repo.description || "No description provided."}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="border-t border-gray-800 pt-8 mt-12">
                    <h3 className="text-xl font-bold mb-6">Comments ({discussion.comments?.length || 0})</h3>

                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="mb-8 relative">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    value={commentInput}
                                    onChange={handleCommentChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add to the discussion... (Type @ to tag a user)"
                                    className="w-full bg-[#161b22] border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 transition resize-none min-h-[60px] text-sm"
                                ></textarea>

                                {/* Mentions Dropdown */}
                                {mentionQuery !== null && (
                                    <div className="absolute bottom-full left-0 mb-1 z-10 w-64 bg-[#1f2937] border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                                        <div className="px-3 py-2 bg-[#161b22] border-b border-gray-700 text-xs font-semibold text-gray-400">
                                            Mentions
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {isSearchingUsers ? (
                                                <div className="p-3 text-sm text-gray-400 text-center">Searching...</div>
                                            ) : mentionResults.length > 0 ? (
                                                mentionResults.map((u, index) => (
                                                    <button
                                                        key={u._id}
                                                        type="button"
                                                        onClick={() => insertMention(u)}
                                                        className={`w-full text-left px-4 py-2 transition flex items-center gap-3 ${index === focusedMentionIndex
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'hover:bg-blue-500/20 hover:text-blue-400'
                                                            }`}
                                                    >
                                                        {u.userProfile ? (
                                                            <img src={u.userProfile} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                                {u.name?.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="truncate leading-tight">{u.name}</span>
                                                            <span className="truncate text-xs text-gray-500 leading-tight">{u.email}</span>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-3 text-sm text-gray-500 text-center">No users found</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={actionLoading || !commentInput.trim()}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-2">
                        {discussion.comments?.map((comment, idx) => (
                            <div key={idx} className="flex gap-3 group">
                                <div className="mt-0.5">
                                    {comment.user?.userProfile ? (
                                        <img src={comment.user.userProfile} alt="User" className="w-8 h-8 rounded-full object-cover bg-gray-800 shrink-0" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                                            {comment.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <h4 className="font-semibold text-sm text-gray-200">{comment.user?.name || "Unknown"}</h4>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                        {(isAuthor || currentUserId === comment.user?._id) && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                disabled={actionLoading}
                                                className="text-gray-600 hover:bg-gray-700 rounded-lg px-1 py-1 opacity-0 group-hover:opacity-100 transition disabled:opacity-0 ml-1 text-xs"
                                                title="Delete Comment"
                                            >
                                                ⛔
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-gray-300 text-[14px] leading-relaxed break-words">
                                        {renderContentWithTags(comment.content)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default DiscussionDetailPage;
