const getFileColor = (fileName) => {

    if (fileName.endsWith(".js"))
        return "text-yellow-400";

    if (fileName.endsWith(".jsx"))
        return "text-cyan-400";

    if (fileName.endsWith(".ts"))
        return "text-blue-400";

    if (fileName.endsWith(".json"))
        return "text-green-400";

    if (fileName.endsWith(".css"))
        return "text-pink-400";

    if (fileName.endsWith(".html"))
        return "text-orange-400";

    if (fileName.endsWith(".py"))
        return "text-blue-300";

    if (fileName.endsWith(".cpp"))
        return "text-purple-400";

    return "text-gray-300";
};

const FileExplorerItem = ({
    file,
    isActive,
    onClick
}) => {

    return (

        <div
            onClick={() =>
                onClick(file)
            }
            className={`
                group
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                cursor-pointer
                transition-all
                duration-200
                border
                text-[15px]
                ${isActive
                    ? "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/5"
                    : "bg-[#161b22] border-transparent hover:bg-[#1b222c]"
                }
            `}
        >

            {/* File Icon */}
            <div
                className={`
                    text-lg
                    ${getFileColor(file.name)}
                `}
            >
                📄
            </div>

            {/* File Name */}
            <div className="flex-1 min-w-0">

                <p
                    className={`
                        truncate
                        font-medium
                        ${isActive
                            ? "text-blue-400"
                            : "text-gray-200"
                        }
                    `}
                >

                    {file.name}

                </p>

            </div>

        </div>
    );
};

export default FileExplorerItem;