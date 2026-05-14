import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";

import { searchRepositories } from "../api/repositoryApi";

import RepositoryCard from "../components/repository/RepositoryCard";

const SearchRepositoriesPage = () => {

    const [query, setQuery] = useState("");

    const [repositories, setRepositories] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {

        e.preventDefault();

        if (!query.trim()) return;

        try {

            setLoading(true);

            const data = await searchRepositories(query);

            setRepositories(
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

    return (

        <DashboardLayout>

            {/* Header */}
            <div className="mb-10">

                <h1 className="text-4xl font-bold">
                    Search Repositories
                </h1>

                <p className="text-gray-400 mt-3">
                    Search repositories across the platform
                </p>

            </div>

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="flex gap-4 mb-12"
            >

                <input
                    type="text"
                    placeholder="Search repositories..."
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

export default SearchRepositoriesPage;