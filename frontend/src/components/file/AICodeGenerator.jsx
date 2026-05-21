import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowUp } from "react-icons/fi";

const AICodeGenerator = ({ onGenerate, isGenerating }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [prompt, setPrompt] = useState("");

    const handleSend = () => {
        if (!prompt.trim() || isGenerating) return;
        onGenerate(prompt);
        setPrompt("");
        // Optionally auto-collapse after sending, but user might want to see it
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="absolute bottom-6 right-6 flex items-center gap-3 z-40">
            {/* Expanded Input Bar */}
            {isExpanded && (
                <div 
                    className="flex items-center bg-[#161b22] border-2 border-blue-500 rounded-full px-4 py-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-fade-in-left"
                    style={{ width: "400px" }}
                >
                    <input
                        type="text"
                        placeholder="Enter prompt to generate code..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isGenerating}
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isGenerating || !prompt.trim()}
                        className={`ml-3 p-1.5 rounded-full flex items-center justify-center transition-all ${
                            isGenerating || !prompt.trim() 
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                                : "bg-blue-500 text-black hover:bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        }`}
                    >
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                        ) : (
                            <FiArrowUp size={16} />
                        )}
                    </button>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 bg-[#161b22] border border-gray-700 hover:border-blue-500 hover:text-blue-400 rounded-xl flex items-center justify-center text-gray-400 transition-all shadow-lg"
                title={isExpanded ? "Hide AI Prompt" : "Show AI Prompt"}
            >
                {isExpanded ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
        </div>
    );
};

export default AICodeGenerator;
