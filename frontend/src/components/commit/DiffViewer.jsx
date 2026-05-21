import { useState } from "react";

const DiffFile = ({ diffItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="
                rounded-xl
                bg-[#0d1117]
                border
                border-gray-800
                overflow-hidden
            "
        >
            {/* FILE HEADER */}
            <div 
                className="px-4 py-3 border-b border-gray-800 bg-[#161b22] text-sm text-gray-300 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-white transition">
                        {isExpanded ? "▼" : "▶"}
                    </button>
                    <span className="font-medium">{diffItem.file_name || "Unknown File"}</span>
                </div>
                <span className={diffItem.action === "CREATE" ? "text-green-400 font-semibold" : diffItem.action === "DELETE" ? "text-red-400 font-semibold" : "text-blue-400 font-semibold"}>
                    {diffItem.action}
                </span>
            </div>

            {/* DIFF LINES */}
            {isExpanded && (
                <div className="p-4 text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto">
                    {
                        diffItem.diff.map((part, index) => (
                            <span
                                key={index}
                                className={`whitespace-pre-wrap ${part.added ? "bg-green-900/30 text-green-400" : part.removed ? "bg-red-900/30 text-red-400" : "text-gray-400"}`}
                            >
                                {part.value}
                            </span>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

const DiffViewer = ({ differences }) => {
    if (!differences || differences.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {differences.map((diffItem) => (
                <DiffFile 
                    key={diffItem.file_id || Math.random()} 
                    diffItem={diffItem} 
                />
            ))}
        </div>
    );
};

export default DiffViewer;
