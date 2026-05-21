import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getCommitById } from "../api/commitApi";
import DiffViewer from "../components/commit/DiffViewer";

const CommitPage = () => {
    const { repoId, commitId } = useParams();
    const [commitData, setCommitData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommit = async () => {
            try {
                setLoading(true);
                const data = await getCommitById(commitId);
                setCommitData(data.payload);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (commitId) {
            fetchCommit();
        }
    }, [commitId]);

    if (loading) {
        return <Loader text="Loading commit details..." />;
    }

    if (!commitData || !commitData.commit) {
        return <p className="text-gray-500">Commit not found</p>;
    }

    return (
                <div>
                    {/* COMMIT HEADER */}
                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 mb-8">
                        <h1 className="text-3xl font-bold mb-4">
                            {commitData.commit.message}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center text-xs font-bold">
                                    {commitData.commit.author?.name?.charAt(0).toUpperCase()}
                                </span>
                                <span>{commitData.commit.author?.name}</span>
                            </div>
                            
                            <p>
                                Branch: <span className="font-semibold text-gray-300">{commitData.commit.branch?.name}</span>
                            </p>

                            <p>
                                {new Date(commitData.commit.createdAt).toLocaleString()}
                            </p>

                            <p className="font-mono bg-[#0d1117] px-3 py-1 rounded-lg border border-gray-800">
                                {commitData.commit._id}
                            </p>
                        </div>
                    </div>

                    {/* DIFFERENCES */}
                    <div>
                        <h2 className="text-xl font-semibold mb-6">
                            Changed Files ({commitData.differences?.length || 0})
                        </h2>
                        
                        <DiffViewer differences={commitData.differences} />
                    </div>
        </div>
    );
};

export default CommitPage;
