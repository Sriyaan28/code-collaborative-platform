import { useState } from "react";

import { createFile } from "../../api/fileApi";
import useModal from "../../hooks/useModal";

const CreateFileModal = ({
    isOpen,
    onClose,
    onFileCreated,
    repoId,
    branchId
}) => {

    const [loading, setLoading] = useState(false);
    const { showModal } = useModal();

    const [formData, setFormData] = useState({
        name: ""
    });

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.name === "name"
                    ? e.target.value.replace(/\s+/g, "-")
                    : e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await createFile({
                name: formData.name,
                repoId,
                branchId
            });

            showModal(res.message, "success");

            setFormData({
                name: ""
            });

            onFileCreated();

            onClose();

        }
        catch (err) {

            showModal(
                err.response?.data?.message ||
                "Failed to create file",
                "error"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="w-full max-w-lg bg-[#161b22] border border-gray-800 rounded-3xl p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-bold">
                        Create File
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <input
                            type="text"
                            name="name"
                            placeholder="example.txt"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                        />

                        <p className="text-sm text-gray-500 mt-2">

                            Spaces will automatically be converted to hyphens.

                        </p>

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Create File"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreateFileModal;