import {
    FiMaximize2,
    FiMinimize2,
    FiSave,
    FiTrash2,
    FiRotateCcw,
    FiRotateCw,
    FiCpu
} from "react-icons/fi";

const FileToolbar = ({
    selectedFile,
    onSave,
    onDelete,
    saving,
    isFullscreen,
    setIsFullscreen,
    onOpenCodeHealth
}) => {

    return (

        <div
            className="
                h-[72px]
                border-b
                border-gray-800
                px-6
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
                        w-11
                        h-11
                        rounded-xl
                        bg-blue-500/10
                        border
                        border-blue-500/20
                        flex
                        items-center
                        justify-center
                        text-lg
                        shrink-0
                    "
                >
                    📄
                </div>

                {/* FILE INFO */}
                <div className="min-w-0">

                    <h2
                        className="
                            text-xl
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
                            text-xs
                            text-gray-500
                            mt-1
                        "
                    >
                        Editing repository file
                    </p>

                </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

                {/* FULLSCREEN */}
                <ToolbarButton
                    icon={
                        isFullscreen
                            ? <FiMinimize2 size={17} />
                            : <FiMaximize2 size={17} />
                    }
                    text={
                        isFullscreen
                            ? "Minimize"
                            : "Fullscreen"
                    }
                    onClick={() =>
                        setIsFullscreen(
                            !isFullscreen
                        )
                    }
                />

                {/* AI CODE HEALTH */}
                <ToolbarButton
                    icon={<FiCpu size={17} />}
                    text="AI"
                    onClick={onOpenCodeHealth}
                    variant="purple"
                />

                {/* UNDO */}
                <ToolbarButton
                    icon={<FiRotateCcw size={17} />}
                    text="Undo"
                    onClick={() =>
                        document.execCommand(
                            "undo"
                        )
                    }
                />

                {/* REDO */}
                <ToolbarButton
                    icon={<FiRotateCw size={17} />}
                    text="Redo"
                    onClick={() =>
                        document.execCommand(
                            "redo"
                        )
                    }
                />

                {/* SAVE */}
                <ToolbarButton
                    icon={<FiSave size={17} />}
                    text={
                        saving
                            ? "Saving"
                            : "Save"
                    }
                    onClick={onSave}
                    variant="blue"
                />

                {/* DELETE */}
                <ToolbarButton
                    icon={<FiTrash2 size={17} />}
                    text="Delete"
                    onClick={onDelete}
                    variant="red"
                />

            </div>

        </div>
    );
};

// BUTTON COMPONENT
const ToolbarButton = ({
    icon,
    text,
    onClick,
    variant = "default"
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
        `
    };

    return (

        <button
            onClick={onClick}
            className={`
                h-11
                px-4
                rounded-xl
                border
                flex
                items-center
                gap-2
                transition-all
                duration-200
                font-medium
                text-sm
                ${variants[variant]}
            `}
        >

            {icon}

            <span>

                {text}

            </span>

        </button>
    );
};

export default FileToolbar;