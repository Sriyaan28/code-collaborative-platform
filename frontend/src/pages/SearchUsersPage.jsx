import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import UserCard from "../components/user/UserCard";
import { searchUsers } from "../api/userApi";
import { useAppCache } from "../context/CacheContext";

const SearchUsersPage = () => {
    const { getCache, setCache } = useAppCache();
    
    const cachedData = getCache("search_users");
    const [query, setQuery] = useState(cachedData?.query || "");
    const [users, setUsers] = useState(cachedData?.users || []);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState(cachedData?.searchType || "name");

    // Persist search query state as user types
    useEffect(() => {
        setCache("search_users", { query, users, searchType });
    }, [query, users, searchType, setCache]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setLoading(true);
            const data = await searchUsers(query, searchType);
            
            let results = [];
            // if backend returns single user
            if (data.payload && !Array.isArray(data.payload)) {
                results = [data.payload];
            } else {
                results = data.payload || [];
            }
            
            setUsers(results);
            setCache("search_users", { query, users: results, searchType });
        } catch (err) {
            console.log(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    return (

        <DashboardLayout>

            {/* Header */}
            <div className="mb-10">

                <h1 className="text-4xl font-bold">
                    Search Users
                </h1>

                <p className="text-gray-400 mt-3">
                    Search developers across the platform
                </p>

            </div>

            {/* Search Type Toggle */}
            <div className="flex gap-4 mb-8">

                <button
                    onClick={() => setSearchType("name")}
                    className={`px-6 py-3 rounded-xl transition font-medium ${searchType === "name"
                            ? "bg-blue-500 text-black"
                            : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Search By Name
                </button>

                <button
                    onClick={() => setSearchType("email")}
                    className={`px-6 py-3 rounded-xl transition font-medium ${searchType === "email"
                            ? "bg-blue-500 text-black"
                            : "bg-[#161b22] hover:bg-[#1f2937]"
                        }`}
                >
                    Search By Email
                </button>

            </div>

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="flex gap-4 mb-12"
            >

                <input
                    type="text"
                    placeholder={
                        searchType === "name"
                            ? "Search users by name..."
                            : "Search users by email..."
                    }
                    value={query}
                    onChange={(e) =>
                        setQuery(e.target.value)
                    }
                    className="flex-1 p-5 rounded-2xl bg-[#161b22] border border-gray-800 outline-none text-lg"
                />

                <button
                    type="submit"
                    className="px-8 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                >
                    Search
                </button>

            </form>

            {/* Results */}
            {
                loading
                    ? (
                        <Loader text="Searching users..." />
                    )
                    : users.length === 0
                        ? (
                            <p className="text-gray-500">
                                No users found
                            </p>
                        )
                        : (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {
                                    users.map((user) => (
                                        <UserCard
                                            key={user._id}
                                            user={user}
                                        />
                                    ))
                                }

                            </div>
                        )
            }

        </DashboardLayout>
    );
};

export default SearchUsersPage;