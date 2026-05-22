import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { searchUsersById } from "../api/userApi";
import { getUserCommits } from "../api/commitApi";
import { useAuth } from "../hooks/useAuth";
import ContributionGraph from "../components/profile/ContributionGraph";
import { useAppCache } from "../context/CacheContext";

const ProfilePage = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const { getCache, setCache } = useAppCache();

    // If no userId in URL, use the logged-in user's ID
    const targetUserId = userId || currentUser?._id;
    const cacheKey = `profile_${targetUserId}`;
    const cachedData = getCache(cacheKey);

    const [loading, setLoading] = useState(!cachedData);
    const [profileUser, setProfileUser] = useState(cachedData?.profileUser || null);
    const [commits, setCommits] = useState(cachedData?.commits || []);

    const isOwnProfile = currentUser?._id === targetUserId;

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!targetUserId) return;
            try {
                if (!cachedData) setLoading(true);

                // Fetch User and Repositories
                const userRes = await searchUsersById(targetUserId);
                const userPayload = userRes.payload;
                
                // Fetch User Commits
                const commitsRes = await getUserCommits(targetUserId);
                const commitsPayload = commitsRes.payload || [];

                setProfileUser(userPayload);
                setCommits(commitsPayload);
                setCache(cacheKey, { profileUser: userPayload, commits: commitsPayload });

            } catch (err) {
                console.error("Failed to load profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [targetUserId, cacheKey, cachedData, setCache]);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading profile..." />
            </DashboardLayout>
        );
    }

    if (!profileUser) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[50vh] text-gray-500">
                    User not found.
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-20 grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Sidebar: User Info */}
                <div className="md:col-span-3">
                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center">
                        <div className="w-40 h-40 rounded-full bg-blue-500 flex items-center justify-center text-6xl font-bold text-black mb-6">
                            {profileUser.userProfile ? (
                                <img src={profileUser.userProfile} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                profileUser.name?.charAt(0)?.toUpperCase()
                            )}
                        </div>
                        
                        <h1 className="text-2xl font-bold text-white mb-2">{profileUser.name}</h1>
                        <p className="text-gray-400 mb-4">{profileUser.email}</p>
                        
                        <p className="text-sm text-gray-500 mb-6">
                            Joined {profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString() : "N/A"}
                        </p>

                        {isOwnProfile && (
                            <button
                                onClick={() => navigate("/settings")}
                                className="w-full py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-[#1f2937] transition text-gray-300 font-medium"
                            >
                                Edit Settings
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Content: Contributions & Repositories */}
                <div className="md:col-span-9 space-y-8">
                    
                    {/* Contribution Graph */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Contributions</h2>
                        <ContributionGraph commits={commits} />
                    </div>

                    {/* Repositories */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Public Repositories <span className="text-gray-500 text-lg font-normal ml-2">({profileUser.repositories?.length || 0})</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileUser.repositories && profileUser.repositories.length > 0 ? (
                                profileUser.repositories.map(repo => (
                                    <div
                                        key={repo._id}
                                        onClick={() => navigate(`/repository/${repo._id}`)}
                                        className="bg-[#161b22] border border-gray-800 hover:border-gray-600 rounded-2xl p-6 cursor-pointer transition flex flex-col"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-bold text-blue-400 truncate">{repo.name}</h3>
                                            <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-400 uppercase tracking-widest">{repo.visibility}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm flex-1 line-clamp-2">
                                            {repo.description || "No description provided."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 p-8 border border-gray-800 rounded-2xl text-center text-gray-500">
                                    No public repositories found.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;