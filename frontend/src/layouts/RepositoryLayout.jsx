import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import RepositoryTabs from "../components/repository/RepositoryTabs";
import Loader from "../components/common/Loader";
import { getRepositoryById } from "../api/repositoryApi";

const RepositoryLayout = () => {
    const { repoId } = useParams();
    const [repository, setRepository] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepository = async () => {
            try {
                setLoading(true);
                const data = await getRepositoryById(repoId);
                setRepository({ ...data.payload, currentUserRole: data.role });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (repoId) {
            fetchRepository();
        }
    }, [repoId]);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading repository..." />
            </DashboardLayout>
        );
    }

    if (!repository) {
        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto text-center mt-20">
                    <h2 className="text-2xl font-bold text-gray-300">Repository not found</h2>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto w-full pb-20">
                {/* Repository Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-5 flex-wrap">
                        <h1 className="text-5xl font-bold text-blue-400">
                            {repository.name}
                        </h1>
                        <span className="px-4 py-2 rounded-full bg-[#161b22] border border-gray-700 text-sm">
                            {repository.visibility}
                        </span>
                    </div>
                    <p className="text-gray-400 mt-6 text-lg leading-8 max-w-4xl">
                        {repository.description || "No description"}
                    </p>
                </div>

                {/* Shared Tabs */}
                <RepositoryTabs repoId={repoId} repository={repository} />

                {/* Sub-page Content */}
                <div className="mt-8">
                    <Outlet context={{ repository }} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RepositoryLayout;
