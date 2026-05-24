import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import useRepository from "../hooks/useRepository";
import { updateRepository } from "../api/repositoryApi";
import useModal from "../hooks/useModal";

const RepositorySettingsPage = () => {
    const { repository } = useOutletContext();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const { repoId, handleDeleteRepo, deleting, fetchRepository } = useRepository();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        visibility: "PUBLIC"
    });

    useEffect(() => {
        if (repository) {
            if (repository.currentUserRole !== 'owner') {
                navigate(`/repository/${repoId}`);
                return;
            }
            setFormData({
                name: repository.name || "",
                description: repository.description || "",
                visibility: repository.visibility || "PUBLIC"
            });
        }
    }, [repository, repoId, navigate]);

    if (!repository || repository.currentUserRole !== 'owner') {
        return null;
    }

    const handleChange = (e) => {
        let value = e.target.value;
        
        // Auto-convert spaces to hyphens for repository name
        if (e.target.name === 'name') {
            value = value.replace(/\s+/g, '-');
        }

        // Limit description to 50 words
        if (e.target.name === 'description') {
            const words = value.trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length > 50) {
                return;
            }
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await updateRepository(repoId, formData);
            if (res.success) {
                showModal("Repository updated successfully", "success");
                await fetchRepository(); // Refresh context to reflect updated data
            }
        } catch (err) {
            console.error(err);
            showModal(err.response?.data?.message || "Failed to update repository", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-10">
            {/* General Settings */}
            <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">General Settings</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Repository Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none focus:border-blue-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none focus:border-blue-500 transition resize-none"
                        ></textarea>
                        <div className="text-right text-gray-500 text-xs mt-2">
                            {formData.description.trim() ? formData.description.trim().split(/\s+/).length : 0} / 50 words
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Visibility</label>
                        <select
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none focus:border-blue-500 transition appearance-none"
                        >
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-black font-semibold rounded-xl transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/20 bg-red-500/5 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Delete Repository</h2>
                <p className="text-gray-400 mb-6">
                    Once you delete a repository, there is no going back. Please be certain.
                </p>

                <button
                    onClick={handleDeleteRepo}
                    disabled={deleting}
                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition disabled:opacity-50"
                >
                    {deleting ? "Deleting Repository..." : "Delete this repository"}
                </button>
            </div>
        </div>
    );
};

export default RepositorySettingsPage;
