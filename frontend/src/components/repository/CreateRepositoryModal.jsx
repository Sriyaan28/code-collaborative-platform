import { useState } from "react";

import { createRepository } from "../../api/repositoryApi";

const CreateRepositoryModal = ({
    isOpen,
    onClose,
    onRepositoryCreated
}) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        visibility: "PUBLIC"
    });

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createRepository(formData);

            onRepositoryCreated();

            onClose();

            setFormData({
                name: "",
                description: "",
                visibility: "PUBLIC"
            });

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to create repository"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="w-full max-w-lg bg-[#161b22] border border-gray-800 rounded-3xl p-8">

                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-bold">
                        Create Repository
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Repository Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none resize-none"
                    />

                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none"
                    >
                        <option value="PUBLIC">
                            PUBLIC
                        </option>

                        <option value="PRIVATE">
                            PRIVATE
                        </option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-400 transition text-black font-semibold py-4 rounded-xl"
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Create Repository"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateRepositoryModal;