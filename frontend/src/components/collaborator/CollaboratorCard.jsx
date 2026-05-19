const CollaboratorCard = ({
    collaborator,
    onRemove
}) => {

    return (

        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">

            <div className="flex items-start justify-between gap-5">

                <div>

                    <h2 className="text-2xl font-semibold text-blue-400">

                        {
                            collaborator.user?.name ||
                            "Unknown User"
                        }

                    </h2>

                    <p className="text-gray-400 mt-2">

                        {
                            collaborator.user?.email
                        }

                    </p>

                    <div className="mt-5">

                        <span className="px-4 py-2 rounded-full bg-[#0d1117] border border-gray-700 text-sm">

                            {collaborator.role}

                        </span>

                    </div>

                </div>

                <button
                    onClick={() =>
                        onRemove(
                            collaborator._id
                        )
                    }
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-black font-semibold"
                >
                    Remove
                </button>

            </div>

        </div>
    );
};

export default CollaboratorCard;