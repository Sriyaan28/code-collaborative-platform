import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { getRepositories } from "../api/repositoryApi";
import Loader from "../components/common/Loader";
import RepositoryCard from "../components/repository/RepositoryCard";
import { useAppCache } from "../context/CacheContext";

const DashboardPage = () => {
    const { user } = useAuth();
    const { getCache, setCache } = useAppCache();

    const cachedData = getCache("dashboard_repos");
    const [userRepositories, setUserRepositories] = useState(cachedData?.userRepositories || []);
    const [publicRepositories, setPublicRepositories] = useState(cachedData?.publicRepositories || []);
    const [activeTab, setActiveTab] = useState("public");
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Only show loader if we have NO cached data
    const [loading, setLoading] = useState(!cachedData);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                if (!cachedData) setLoading(true);
                const data = await getRepositories();
                
                const userRepos = data.payload.userRepositories || [];
                const pubRepos = data.payload.publicRepositories || [];
                
                setUserRepositories(userRepos);
                setPublicRepositories(pubRepos);
                setCache("dashboard_repos", { userRepositories: userRepos, publicRepositories: pubRepos });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setCache]);

    const repositories =
        activeTab === "public"
            ? publicRepositories
            : userRepositories;

    return (

        <DashboardLayout>

            {/* Header */}
            <div>

                <h1 className="text-4xl font-bold">
                    Dashboard
                </h1>

                <p className="mt-3 text-gray-400">
                    Welcome back, {user?.name}
                </p>

            </div>

            {/* Divider */}
            <div className="border-b border-gray-800 mt-8 mb-8"></div>

            {/* Tabs */}
            <div className="flex items-center gap-4 mb-10">

                <button
                    onClick={() => setActiveTab("public")}
                    className={`px-6 py-3 rounded-xl transition font-medium ${activeTab === "public"
                        ? "bg-blue-500 text-black"
                        : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Public Repositories
                </button>

                <button
                    onClick={() => setActiveTab("user")}
                    className={`px-6 py-3 rounded-xl transition font-medium ${activeTab === "user"
                        ? "bg-blue-500 text-black"
                        : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Your Repositories
                </button>

            </div>

            {/* Content */}
            {
                loading
                    ? (
                        <Loader text="Loading repositories..." />
                    )
                    : repositories.length === 0
                        ? (
                            <p className="text-gray-500">
                                No repositories found
                            </p>
                        )
                        : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {
                                    repositories.map((repo) => (
                                        <RepositoryCard
                                            key={repo._id}
                                            repository={repo}
                                        />
                                    ))
                                }

                            </div>
                        )
            }

        </DashboardLayout>
    );
};

export default DashboardPage;