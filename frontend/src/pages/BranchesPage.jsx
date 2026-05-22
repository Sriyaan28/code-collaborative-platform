import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loader from "../components/common/Loader";
import BranchCard from "../components/branches/BranchCard";
import useBranch from "../hooks/useBranch";

const BranchesPage = () => {
    const { repository } = useOutletContext();
    const { branches, loading, creating, fetchBranches, handleCreateBranch, handleDeleteBranch } = useBranch();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [branchName, setBranchName] = useState("");

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const onSubmitCreate = async (e) => {
        e.preventDefault();
        const success = await handleCreateBranch(branchName);
        if (success) {
            setBranchName("");
            setShowCreateModal(false);
        }
    };

    return (
        <div>

            {/* Header */}
            <div className="flex items-center justify-between mb-10">

                <div>

                    <h1 className="text-4xl font-bold">
                        Branches
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Manage repository branches
                    </p>

                </div>

                {repository?.currentUserRole !== 'viewer' && (
                    <button
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                        className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                    >
                        + Create Branch
                    </button>
                )}

            </div>

            {/* Branches */}
            {
                loading
                    ? (
                        <Loader text="Loading branches..." />
                    )
                    : branches.length === 0
                        ? (
                            <p className="text-gray-500">
                                No branches found
                            </p>
                        )
                        : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {
                                    branches.map((branch) => (

                                        <div
                                            key={branch._id}
                                            className="relative"
                                        >

                                            <BranchCard
                                                branch={branch}
                                            />

                                            {/* Actions */}
                                            <div className="mt-4 flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        handleDeleteBranch(
                                                            branch._id
                                                        )
                                                    }
                                                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 transition text-black font-semibold"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    ))
                                }

                            </div>
                        )
            }

            {/* CREATE MODAL */}
            {
                showCreateModal && (

                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

                        <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-3xl p-8">

                            <div className="flex items-center justify-between mb-8">

                                <h2 className="text-3xl font-bold">
                                    Create Branch
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                    className="text-gray-400 hover:text-white text-xl"
                                >
                                    ✕
                                </button>

                            </div>

                            <form
                                onSubmit={onSubmitCreate}
                                className="space-y-5"
                            >

                                <input
                                    type="text"
                                    placeholder="Branch name"
                                    value={branchName}
                                    onChange={(e) =>
                                        setBranchName(
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                                />

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                                >
                                    {
                                        creating
                                            ? "Creating..."
                                            : "Create Branch"
                                    }
                                </button>

                            </form>

                        </div>

                    </div>
                )
            }

        </div>
    );
};

export default BranchesPage;