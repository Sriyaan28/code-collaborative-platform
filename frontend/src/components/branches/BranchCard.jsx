const BranchCard = ({ branch }) => {

    return (

        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-blue-500 transition">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-semibold text-blue-400">
                        {branch.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Branch
                    </p>

                </div>

                {
                    branch.name === "main" && (
                        <span className="px-4 py-2 rounded-full bg-blue-500 text-black text-sm font-semibold">
                            Default
                        </span>
                    )
                }

            </div>

        </div>
    );
};

export default BranchCard;