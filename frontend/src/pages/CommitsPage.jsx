import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import {
    getRepoCommits,
    rollbackCommit
} from "../api/commitApi";

import DiffViewer from "../components/commit/DiffViewer";
import useModal from "../hooks/useModal";

const CommitsPage = () => {

    const { repoId } = useParams();

    const [commits, setCommits] =
        useState([]);
    const { showModal } = useModal();

    const [loading, setLoading] =
        useState(true);

    const [rollingBack, setRollingBack] =
        useState(null);

    const fetchCommits = async () => {

        try {

            setLoading(true);

            const data =
                await getRepoCommits(
                    repoId
                );

            setCommits(
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

        fetchCommits();

    }, [repoId]);

    // ROLLBACK
    const handleRollback = async (
        commitId
    ) => {

        const confirmRollback =
            window.confirm(
                "Rollback repository to this commit?"
            );

        if (!confirmRollback) return;

        try {

            setRollingBack(commitId);

            const res = await rollbackCommit({
                repository: repoId,
                commitId
            });

            showModal(
                res.message,
                "success"
            );

            fetchCommits();

        }
        catch (err) {

            console.log(err);

            showModal(
                err.response?.data?.message ||
                "Failed to rollback commit",
                "error"
            );
        }
        finally {

            setRollingBack(null);
        }
    };

    return (

        <DashboardLayout>

            {/* Back Button */}
            <div className="mb-6">
                <Link 
                    to={`/repository/${repoId}`}
                    className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm w-fit"
                >
                    <span>←</span> Back to Repository Overview
                </Link>
            </div>

            {/* HEADER */}
            <div className="mb-10">

                <h1 className="text-4xl font-bold">
                    Commits
                </h1>

                <p className="text-gray-400 mt-3">
                    Repository commit history
                </p>

            </div>

            {/* COMMITS */}
            {
                loading
                    ? (
                        <Loader text="Loading commits..." />
                    )
                    : commits.length === 0
                        ? (
                            <p className="text-gray-500">
                                No commits found
                            </p>
                        )
                        : (
                            <div className="space-y-6">

                                {
                                    commits.map((commit) => (

                                        <div
                                            key={commit._id}
                                            className="
                                                bg-[#161b22]
                                                border
                                                border-gray-800
                                                rounded-3xl
                                                p-6
                                            "
                                        >

                                            {/* TOP */}
                                            <div className="flex items-start justify-between gap-6">

                                                <div>

                                                    <Link to={`/repository/${repoId}/commit/${commit._id}`}>
                                                        <h2 className="text-xl font-semibold hover:text-blue-400 transition cursor-pointer">
                                                            {
                                                                commit.message
                                                            }
                                                        </h2>
                                                    </Link>

                                                    <p className="text-gray-400 mt-2 text-sm break-all">
                                                        Commit ID: {commit._id}
                                                    </p>

                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleRollback(
                                                            commit._id
                                                        )
                                                    }
                                                    disabled={
                                                        rollingBack === commit._id
                                                    }
                                                    className="
                                                        px-5
                                                        py-2
                                                        rounded-xl
                                                        border border-gray-700
                                                        text-gray-300
                                                        hover:border-red-500
                                                        hover:text-red-400
                                                        transition
                                                        text-sm
                                                        font-semibold
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    {
                                                        rollingBack === commit._id
                                                            ? "Rolling Back..."
                                                            : "Rollback"
                                                    }
                                                </button>

                                            </div>

                                            {/* INFO */}
                                            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">

                                                <p>
                                                    Files:
                                                    {" "}
                                                    {
                                                        commit.files_changed?.length || 0
                                                    }
                                                </p>

                                                <p>
                                                    {
                                                        new Date(
                                                            commit.createdAt
                                                        ).toLocaleString()
                                                    }
                                                </p>

                                            </div>

                                            {/* DIFFERENCES */}
                                            {
                                                commit.differences?.length > 0 && (

                                                    <div className="mt-6">

                                                        <h3 className="text-sm font-semibold mb-3 text-gray-300">
                                                            Changed Files
                                                        </h3>

                                                        <div className="flex flex-col gap-4">

                                                            <DiffViewer differences={commit.differences} />

                                                        </div>

                                                    </div>
                                                )
                                            }

                                        </div>
                                    ))
                                }

                            </div>
                        )
            }

        </DashboardLayout>
    );
};

export default CommitsPage;