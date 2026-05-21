import { useState } from "react";
import { createPullRequest } from "../../api/prApi";
import useModal from "../../hooks/useModal";

const CreatePRModal = ({ isOpen, onClose, onPRCreated, repository, branches }) => {
    const { showModal } = useModal();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        sourceBranch: "",
        targetBranch: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.sourceBranch || !formData.targetBranch) {
            return showModal("All fields are required", "error");
        }

        if (formData.sourceBranch === "main") {
            return showModal("Source branch cannot be main", "error");
        }

        if (formData.sourceBranch === formData.targetBranch) {
            return showModal("Source and target branches cannot be the same", "error");
        }

        try {
            setLoading(true);

            const res = await createPullRequest({
                ...formData,
                repository
            });

            showModal(res.message, "success");
            
            setFormData({
                title: "",
                description: "",
                sourceBranch: "",
                targetBranch: ""
            });

            onPRCreated();
            onClose();

        } catch (err) {
            showModal(err.response?.data?.message || "Failed to create PR", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f141b] border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold">New Pull Request</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                            placeholder="Enter PR title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition min-h-[120px] resize-y"
                            placeholder="Describe your changes..."
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">Source Branch</label>
                            <select
                                value={formData.sourceBranch}
                                onChange={(e) => setFormData({ ...formData, sourceBranch: e.target.value })}
                                className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                required
                            >
                                <option value="">Select Branch</option>
                                {branches.filter(b => b.name !== 'main').map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end pb-3 text-gray-500">
                            →
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">Target Branch</label>
                            <select
                                value={formData.targetBranch}
                                onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
                                className="w-full bg-[#161b22] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                required
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition font-medium"
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Pull Request"}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default CreatePRModal;
