import { useState, useEffect, useRef } from "react";
import { createDiscussion } from "../../api/discussionApi";
import { searchUsers } from "../../api/userApi";
import { searchRepositories } from "../../api/repositoryApi";

const CreateDiscussionModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mentions state
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const [mentionQuery, setMentionQuery] = useState(null);
    const [mentionResults, setMentionResults] = useState([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [focusedMentionIndex, setFocusedMentionIndex] = useState(0);
    const textareaRef = useRef(null);
    
    // Repositories state
    const [linkedRepositories, setLinkedRepositories] = useState([]);
    const [repoQuery, setRepoQuery] = useState("");
    const [repoResults, setRepoResults] = useState([]);
    const [isSearchingRepos, setIsSearchingRepos] = useState(false);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setContent("");
            setTagsInput("");
            setMentionedUsers([]);
            setLinkedRepositories([]);
            setMentionQuery(null);
            setRepoQuery("");
            setError(null);
        }
    }, [isOpen]);

    // Handle Mention Search
    useEffect(() => {
        const fetchUsers = async () => {
            if (mentionQuery === null) {
                setMentionResults([]);
                return;
            }
            if (mentionQuery.length === 0) {
                setMentionResults([]); // wait for at least 1 char maybe? Or show top active. Let's show empty for now.
            }
            
            setIsSearchingUsers(true);
            try {
                // If query is empty, maybe search "a" just to get some users, or we just only search when length > 0
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

    // Handle Repo Search
    useEffect(() => {
        const fetchRepos = async () => {
            if (!repoQuery.trim()) {
                setRepoResults([]);
                return;
            }
            setIsSearchingRepos(true);
            try {
                const res = await searchRepositories(repoQuery);
                setRepoResults(res.payload || []);
            } catch (err) {
                console.error("Failed to search repos", err);
            } finally {
                setIsSearchingRepos(false);
            }
        };

        const debounce = setTimeout(fetchRepos, 300);
        return () => clearTimeout(debounce);
    }, [repoQuery]);

    if (!isOpen) return null;

    // Detect @ typing in textarea
    const handleContentChange = (e) => {
        const val = e.target.value;
        setContent(val);
        
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

    // Insert Mention
    const insertMention = (user) => {
        const cursor = textareaRef.current.selectionStart;
        const textBeforeCursor = content.slice(0, cursor);
        const textAfterCursor = content.slice(cursor);
        
        // Find where the @ started
        const match = textBeforeCursor.match(/@(\w*)$/);
        if (match) {
            const startIdx = match.index;
            const newTextBefore = content.slice(0, startIdx);
            
            // Format: @[User Name](userId)
            const mentionText = `@[${user.name}](${user._id}) `;
            
            setContent(newTextBefore + mentionText + textAfterCursor);
            
            // Add to tracking array if not already there
            if (!mentionedUsers.includes(user._id)) {
                setMentionedUsers(prev => [...prev, user._id]);
            }
            
            setMentionQuery(null);
            
            // Focus back to textarea (async to let state update)
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    const newPos = startIdx + mentionText.length;
                    textareaRef.current.setSelectionRange(newPos, newPos);
                }
            }, 0);
        }
    };

    const addRepo = (repo) => {
        if (!linkedRepositories.find(r => r._id === repo._id)) {
            setLinkedRepositories(prev => [...prev, repo]);
        }
        setRepoQuery("");
        setRepoResults([]);
    };

    const removeRepo = (repoId) => {
        setLinkedRepositories(prev => prev.filter(r => r._id !== repoId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        const tags = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag);
        const repoIds = linkedRepositories.map(r => r._id);

        try {
            setLoading(true);
            await createDiscussion({ 
                title, 
                content, 
                tags,
                mentionedUsers,
                linkedRepositories: repoIds
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to publish discussion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#0d1117] border border-gray-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold">Write a Tech Blog</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition text-2xl leading-none">
                        &times;
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form id="create-discussion-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-[#161b22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                placeholder="How to master React in 2026..."
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Content <span className="text-gray-600">(Type @ to mention users)</span>
                            </label>
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={handleContentChange}
                                onKeyDown={handleKeyDown}
                                rows={10}
                                className="w-full bg-[#161b22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition resize-none font-mono text-sm leading-relaxed"
                                placeholder="Write your blog content here..."
                            ></textarea>

                            {/* Mentions Dropdown */}
                            {mentionQuery !== null && (
                                <div className="absolute z-10 w-64 bg-[#1f2937] border border-gray-700 rounded-xl shadow-xl mt-1 overflow-hidden">
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
                                                    className={`w-full text-left px-4 py-2 transition flex items-center gap-3 ${
                                                        index === focusedMentionIndex 
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Linked Repositories</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={repoQuery}
                                    onChange={(e) => setRepoQuery(e.target.value)}
                                    className="w-full bg-[#161b22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Search and link a repository..."
                                />
                                {repoQuery && (
                                    <div className="absolute z-10 w-full bg-[#1f2937] border border-gray-700 rounded-xl shadow-xl mt-2 overflow-hidden max-h-48 overflow-y-auto">
                                        {isSearchingRepos ? (
                                            <div className="p-3 text-sm text-gray-400 text-center">Searching...</div>
                                        ) : repoResults.length > 0 ? (
                                            repoResults.map(r => (
                                                <button
                                                    key={r._id}
                                                    type="button"
                                                    onClick={() => addRepo(r)}
                                                    className="w-full text-left px-4 py-3 hover:bg-blue-500/20 hover:text-blue-400 transition flex items-center gap-3 border-b border-gray-800 last:border-0"
                                                >
                                                    <span className="text-xl">📁</span>
                                                    <div>
                                                        <div className="font-semibold">{r.name}</div>
                                                        <div className="text-xs text-gray-500 truncate">{r.description || 'No description'}</div>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-3 text-sm text-gray-500 text-center">No repositories found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {/* Selected Repositories Chips */}
                            {linkedRepositories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {linkedRepositories.map(r => (
                                        <div key={r._id} className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm">
                                            <span>📁 {r.name}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => removeRepo(r._id)}
                                                className="hover:text-blue-300 ml-1"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full bg-[#161b22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                placeholder="javascript, react, performance"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-800 flex justify-end gap-3 shrink-0 bg-[#0d1117]">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        form="create-discussion-form"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateDiscussionModal;
