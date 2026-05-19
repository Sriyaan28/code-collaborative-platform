const FileCard = ({
    file,
    onDelete
}) => {

    return (

        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-5 hover:border-blue-500 transition">

            <div className="flex items-center justify-between gap-5">

                <div className="flex-1">

                    <h2 className="text-xl font-semibold text-blue-400 break-all">
                        {file.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        File
                    </p>

                </div>

                <button
                    onClick={() =>
                        onDelete(file._id)
                    }
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-black font-semibold"
                >
                    Delete
                </button>

            </div>

        </div>
    );
};

export default FileCard;