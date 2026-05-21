import {
    FiMaximize2,
    FiMinimize2,
    FiSave,
    FiTrash2,
    FiRotateCcw,
    FiRotateCw,
    FiCpu,
    FiGitCommit
} from "react-icons/fi";

const FileToolbar = ({
    selectedFile,
    onSave,
    onDelete,
    saving,
    isFullscreen,
    setIsFullscreen,
    onOpenCodeHealth,
    onOpenCommit
}) => {

    return (

        <div
            className="
                h-[64px]
                border-b
                border-gray-800
                px-5
                flex
                items-center
                justify-between
                bg-[#0f141b]
                shrink-0
            "
        >

            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-0">

                {/* FILE ICON */}
                <div
                    className="
                        w-10
                        h-10
                        rounded-xl
                        bg-blue-500/10
                        border
                        border-blue-500/20
                        flex
                        items-center
                        justify-center
                        text-sm
                        shrink-0
                    "
                >
                    📄
                </div>

                {/* FILE INFO */}
                <div className="min-w-0">

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-blue-400
                            truncate
                        "
                    >

                        {
                            selectedFile?.name
                        }

                    </h2>

                    <p
                        className="
                            text-[11px]
                            text-gray-500
                            mt-0.5
                        "
                    >
                        Editing repository file
                    </p>

                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

                {/* COMMIT */}
                <ToolbarButton
                    icon={<FiGitCommit size={15} />}
                    onClick={onOpenCommit}
                    variant="green"
                />

                {/* AI */}
                <ToolbarButton
                    icon={<FiCpu size={15} />}
                    onClick={onOpenCodeHealth}
                    variant="purple"
                />

                {/* UNDO */}
                <ToolbarButton
                    icon={<FiRotateCcw size={15} />}
                    onClick={() =>
                        document.execCommand(
                            "undo"
                        )
                    }
                />

                {/* REDO */}
                <ToolbarButton
                    icon={<FiRotateCw size={15} />}
                    onClick={() =>
                        document.execCommand(
                            "redo"
                        )
                    }
                />

                {/* FULLSCREEN */}
                <ToolbarButton
                    icon={
                        isFullscreen
                            ? <FiMinimize2 size={15} />
                            : <FiMaximize2 size={15} />
                    }
                    onClick={() =>
                        setIsFullscreen(
                            !isFullscreen
                        )
                    }
                />

                {/* SAVE */}
                <ToolbarButton
                    icon={<FiSave size={15} />}
                    onClick={onSave}
                    variant="blue"
                    disabled={saving}
                />

                {/* DELETE */}
                <ToolbarButton
                    icon={<FiTrash2 size={15} />}
                    onClick={onDelete}
                    variant="red"
                />

            </div>

        </div>
    );
};

// BUTTON
const ToolbarButton = ({
    icon,
    onClick,
    variant = "default",
    disabled = false
}) => {

    const variants = {

        default: `
            bg-[#161b22]
            hover:bg-[#1f2937]
            border-gray-700
            text-gray-200
        `,

        blue: `
            bg-blue-500
            hover:bg-blue-400
            border-blue-400
            text-black
        `,

        red: `
            bg-red-500
            hover:bg-red-400
            border-red-400
            text-black
        `,

        purple: `
            bg-purple-500
            hover:bg-purple-400
            border-purple-400
            text-black
        `,

        green: `
            bg-green-500
            hover:bg-green-400
            border-green-400
            text-black
        `
    };

    return (

        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-10
                h-10
                rounded-xl
                border
                flex
                items-center
                justify-center
                transition-all
                duration-200
                disabled:opacity-50
                ${variants[variant]}
            `}
        >

            {icon}

        </button>
    );
};

export default FileToolbar;