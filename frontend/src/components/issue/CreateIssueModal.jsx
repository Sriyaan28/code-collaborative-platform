import { useState, useEffect } from "react";
import { searchUsers } from "../../api/userApi";
import { createIssue } from "../../api/issueApi";
import useModal from "../../hooks/useModal";

const CreateIssueModal = ({
    isOpen,
    onClose,
    onIssueCreated,
    repoId,
    initialData = null
}) => {
    const { showModal } = useModal();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignees: [] // array of user objects
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("name");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title || "",
                    description: initialData.description || "",
                    assignees: []
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    assignees: []
                });
            }
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setSearchLoading(true);
            const data = await searchUsers(searchQuery, searchType);
            
            if (data.payload && !Array.isArray(data.payload)) {
                setSearchResults([data.payload]);
            } else {
                setSearchResults(data.payload || []);
            }
        } catch (err) {
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAddAssignee = (user) => {
        if (!formData.assignees.find(a => a._id === user._id)) {
            setFormData(prev => ({
                ...prev,
                assignees: [...prev.assignees, user]
            }));
        }
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleRemoveAssignee = (userId) => {
        setFormData(prev => ({
            ...prev,
            assignees: prev.assignees.filter(a => a._id !== userId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            return showModal("Title and description are required", "error");
        }

        try {
            setLoading(true);

            const res = await createIssue({
                repository: repoId,
                title: formData.title,
                description: formData.description,
                assignees: formData.assignees.map(a => a._id)
            });

            showModal(res.message, "success");
            onIssueCreated();
            onClose();
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to create issue", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f141b] border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                
                <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold">New Issue</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                placeholder="Issue title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition min-h-[150px] resize-y"
                                placeholder="Describe the issue..."
                                required
                            />
                        </div>

                        {/* Assignees Section */}
                        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5">
                            <label className="block text-sm text-gray-400 mb-4">Assignees</label>
                            
                            {/* Selected Assignees */}
                            {formData.assignees.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.assignees.map(assignee => (
                                        <div key={assignee._id} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                                            <img src={assignee.userProfile} alt="" className="w-5 h-5 rounded-full" />
                                            {assignee.name}
                                            <button type="button" onClick={() => handleRemoveAssignee(assignee._id)} className="text-gray-400 hover:text-red-400 ml-1">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Search Assignees */}
                            <div className="flex gap-3 mb-3">
                                <select 
                                    value={searchType} 
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="bg-[#161b22] border border-gray-700 rounded-xl px-3 py-2 text-white outline-none text-sm"
                                >
                                    <option value="name">Name</option>
                                    <option value="email">Email</option>
                                </select>
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                        placeholder="Search users to assign..."
                                        className="flex-1 bg-[#161b22] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none transition text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition text-sm font-medium"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

                            {/* Search Results */}
                            {searchLoading ? (
                                <p className="text-sm text-gray-500">Searching...</p>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-2 mt-4 max-h-[150px] overflow-y-auto custom-scrollbar">
                                    {searchResults.map(user => (
                                        <div 
                                            key={user._id}
                                            onClick={() => handleAddAssignee(user)}
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#161b22] cursor-pointer transition"
                                        >
                                            <img src={user.userProfile} alt="" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-300">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-gray-800 flex justify-end gap-3 shrink-0 bg-[#0f141b] rounded-b-3xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition font-medium"
                    >
                        Cancel
                    </button>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Issue"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreateIssueModal;
