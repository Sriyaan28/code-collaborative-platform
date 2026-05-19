import FileExplorerItem from "./FileExplorerItem";

const FileExplorer = ({
    width,
    setWidth,
    branches,
    selectedBranch,
    setSelectedBranch,
    files,
    selectedFile,
    setSelectedFile,
    onCreateFile
}) => {

    return (

        <div
            className="
                h-full
                border-r
                border-gray-800
                bg-[#0f141b]
                flex
                flex-col
                relative
                shrink-0
            "
            style={{
                width: `${width}px`,
                minWidth: "220px",
                maxWidth: "420px"
            }}
        >

            {/* TOP */}
            <div className="p-5 border-b border-gray-800">

                {/* EXPLORER HEADER */}
                <div className="flex items-center justify-between mb-5">

                    <h2 className="text-xs tracking-[0.25em] text-gray-500 font-semibold">

                        EXPLORER

                    </h2>

                    {/* CREATE FILE */}
                    <button
                        onClick={onCreateFile}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            bg-[#161b22]
                            hover:bg-[#1f2937]
                            border
                            border-gray-700
                            hover:border-blue-500
                            transition-all
                            text-lg
                            text-gray-300
                            hover:text-blue-400
                        "
                        title="Create File"
                    >
                        📄
                    </button>

                </div>

                {/* BRANCH */}
                <div>

                    <label className="block text-xs tracking-[0.25em] text-gray-500 font-semibold mb-3">

                        BRANCH

                    </label>

                    <select
                        value={selectedBranch}
                        onChange={(e) =>
                            setSelectedBranch(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            p-3
                            rounded-xl
                            bg-[#161b22]
                            border
                            border-gray-700
                            outline-none
                            text-sm
                            focus:border-blue-500
                            transition
                        "
                    >

                        {
                            branches.map((branch) => (

                                <option
                                    key={branch._id}
                                    value={branch._id}
                                >

                                    {branch.name}

                                </option>
                            ))
                        }

                    </select>

                </div>

            </div>

            {/* FILES */}
            <div className="px-5 pt-5 pb-3">

                <h2 className="text-xs tracking-[0.25em] text-gray-500 font-semibold">

                    FILES

                </h2>

            </div>

            {/* FILE LIST */}
            <div
                className="
                    flex-1
                    overflow-y-auto
                    custom-scrollbar
                    px-3
                    pb-5
                    space-y-2
                "
            >

                {
                    files.length === 0
                        ? (
                            <div className="px-3 py-5 text-gray-500 text-sm">

                                No files found

                            </div>
                        )
                        : (

                            files.map((file) => (

                                <FileExplorerItem
                                    key={file._id}
                                    file={file}
                                    isActive={
                                        selectedFile?._id === file._id
                                    }
                                    onClick={setSelectedFile}
                                />
                            ))
                        )
                }

            </div>

            {/* DRAG HANDLE */}
            <div
                onMouseDown={(e) => {

                    e.preventDefault();

                    const startX =
                        e.clientX;

                    const startWidth =
                        width;

                    const handleMouseMove = (
                        moveEvent
                    ) => {

                        const newWidth =
                            startWidth +
                            (
                                moveEvent.clientX -
                                startX
                            );

                        if (
                            newWidth >= 220 &&
                            newWidth <= 420
                        ) {

                            setWidth(newWidth);
                        }
                    };

                    const handleMouseUp = () => {

                        window.removeEventListener(
                            "mousemove",
                            handleMouseMove
                        );

                        window.removeEventListener(
                            "mouseup",
                            handleMouseUp
                        );
                    };

                    window.addEventListener(
                        "mousemove",
                        handleMouseMove
                    );

                    window.addEventListener(
                        "mouseup",
                        handleMouseUp
                    );
                }}
                className="
                    absolute
                    top-0
                    right-0
                    w-1.5
                    h-full
                    cursor-col-resize
                    group
                    z-50
                "
            >

                <div
                    className="
                        w-full
                        h-full
                        bg-transparent
                        group-hover:bg-blue-500/30
                        transition
                    "
                />

            </div>

        </div>
    );
};

export default FileExplorer;