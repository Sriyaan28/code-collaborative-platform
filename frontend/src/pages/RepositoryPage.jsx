import { useOutletContext } from "react-router-dom";

const RepositoryPage = () => {
    const { repository } = useOutletContext();

    if (!repository) return null;

    return (
        <div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">

                    <h2 className="text-2xl font-semibold mb-5">
                        Repository Info
                    </h2>

                    <div className="space-y-4 text-gray-400">

                        <p>

                            <span className="text-white">
                                Repository ID:
                            </span>

                            {" "}
                            {repository._id}

                        </p>

                        <p>

                            <span className="text-white">
                                Visibility:
                            </span>

                            {" "}
                            {repository.visibility}

                        </p>

                    </div>

                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">

                    <h2 className="text-2xl font-semibold mb-5">
                        Details
                    </h2>

                    <div className="space-y-4 text-gray-400">

                        <p>
                            <span className="text-white">Owner:</span>{" "}
                            {repository.owner?.name || "Unknown"}
                        </p>

                        <p>
                            <span className="text-white">Created At:</span>{" "}
                            {new Date(repository.createdAt).toLocaleDateString()}
                        </p>

                        <p>
                            <span className="text-white">Updated At:</span>{" "}
                            {new Date(repository.updatedAt).toLocaleDateString()}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default RepositoryPage;