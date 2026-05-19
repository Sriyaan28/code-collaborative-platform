import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import BranchCard from "../components/branches/BranchCard";

import {
    getBranches,
    createBranch,
    switchBranch,
    deleteBranch
} from "../api/branchApi";

const BranchesPage = () => {

    const { repoId } = useParams();

    const [branches, setBranches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [branchName, setBranchName] = useState("");

    const [creating, setCreating] = useState(false);

    const fetchBranches = async () => {

        try {

            setLoading(true);

            const data = await getBranches(repoId);

            setBranches(
                data.payload || []
            );

        }
        catch (err) {

            console.log(err);
        }
        finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchBranches();

    }, [repoId]);

    // CREATE BRANCH
    const handleCreateBranch = async (e) => {

        e.preventDefault();

        if (!branchName.trim()) return;

        try {

            setCreating(true);

            await createBranch({
                name: branchName,
                repoId: repoId
            });

            setBranchName("");

            setShowCreateModal(false);

            fetchBranches();

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to create branch"
            );
        }
        finally {

            setCreating(false);
        }
    };

    // SWITCH BRANCH
    const handleSwitchBranch = async (
        branchId
    ) => {

        try {

            await switchBranch(branchId);

            fetchBranches();

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to switch branch"
            );
        }
    };

    // DELETE BRANCH
    const handleDeleteBranch = async (
        branchId
    ) => {

        const confirmDelete = window.confirm(
            "Delete this branch?"
        );

        if (!confirmDelete) return;

        try {

            await deleteBranch(
                repoId,
                branchId
            );

            fetchBranches();

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete branch"
            );
        }
    };

    return (

        <DashboardLayout>

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

                <button
                    onClick={() =>
                        setShowCreateModal(true)
                    }
                    className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                >
                    + Create Branch
                </button>

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
                                                        handleSwitchBranch(
                                                            branch._id
                                                        )
                                                    }
                                                    className="flex-1 py-3 rounded-xl bg-[#161b22] border border-gray-700 hover:border-blue-500 transition"
                                                >
                                                    Switch
                                                </button>

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
                                onSubmit={handleCreateBranch}
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

        </DashboardLayout>
    );
};

export default BranchesPage;