import { useState } from "react";

import {
    createCommit
} from "../../api/commitApi";
import useModal from "../../hooks/useModal";

const CreateCommitModal = ({
    isOpen,
    onClose,
    files,
    repository,
    onCommitCreated
}) => {

    const [message, setMessage] =
        useState("");



    const [loading, setLoading] =
        useState(false);
    const { showModal } = useModal();

    if (!isOpen) return null;



    // CREATE COMMIT
    const handleCreateCommit = async () => {

        if (!message.trim()) {

            return showModal(
                "Commit message required",
                "error"
            );
        }

        if (files.length === 0) {

            return showModal(
                "No files to commit",
                "error"
            );
        }

        try {

            setLoading(true);

            const allFileIds = files.map(f => f._id);

            const res = await createCommit({
                repository,
                message,
                files: allFileIds
            });

            console.log("res.data:", res);

            showModal(
                res.message,
                "success"
            );

            setMessage("");



            onCommitCreated?.();

            onClose();

        }
        catch (err) {

            console.log(err);

            showModal(
                err.response?.data?.message ||
                "Failed to create commit",
                "error"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/70
                z-50
                flex
                items-center
                justify-center
                p-6
            "
        >

            <div
                className="
                    bg-[#161b22]
                    w-full
                    max-w-2xl
                    rounded-3xl
                    border
                    border-gray-800
                    p-8
                    max-h-[90vh]
                    overflow-y-auto
                "
            >

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-bold">
                        Create Commit
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-gray-400
                            hover:text-white
                            text-xl
                        "
                    >
                        ✕
                    </button>

                </div>

                {/* MESSAGE */}
                <div className="mb-8">

                    <label className="block mb-3 text-sm text-gray-400">
                        Commit Message
                    </label>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreateCommit();
                            }
                        }}
                        placeholder="Enter commit message..."
                        className="
                            w-full
                            bg-[#0d1117]
                            border
                            border-gray-700
                            rounded-2xl
                            px-5
                            py-4
                            outline-none
                            focus:border-blue-500
                        "
                    />

                </div>



                {/* ACTIONS */}
                <div className="flex justify-end gap-4 mt-10">

                    <button
                        onClick={onClose}
                        className="
                            px-6
                            py-3
                            rounded-2xl
                            bg-gray-800
                            hover:bg-gray-700
                            transition
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreateCommit}
                        disabled={loading}
                        className="
                            px-6
                            py-3
                            rounded-2xl
                            bg-blue-500
                            hover:bg-blue-400
                            transition
                            text-black
                            font-semibold
                            disabled:opacity-50
                        "
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Create Commit"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CreateCommitModal;