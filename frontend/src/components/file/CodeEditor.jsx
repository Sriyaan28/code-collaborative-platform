import { useEffect, useMemo, useRef } from "react";

const CodeEditor = ({
    content,
    setContent,
    onSave,
    isGenerating,
    isReviewing,
    onAccept,
    onReject
}) => {

    const textareaRef = useRef(null);

    const lineNumberRef = useRef(null);

    // GENERATE LINE NUMBERS
    const lineNumbers = useMemo(() => {

        return content
            .split("\n")
            .map((_, index) => index + 1);

    }, [content]);

    // SYNC SCROLL
    const handleScroll = () => {

        if (
            lineNumberRef.current &&
            textareaRef.current
        ) {

            lineNumberRef.current.scrollTop =
                textareaRef.current.scrollTop;
        }
    };

    // TAB & SAVE SUPPORT
    const handleKeyDown = (e) => {

        // Handle Review Mode Actions
        if (isReviewing) {
            if (e.key === "Tab") {
                e.preventDefault();
                if (onAccept) onAccept();
            } else if (e.key === "Escape") {
                e.preventDefault();
                if (onReject) onReject();
            }
            return; // Block other actions while reviewing
        }

        if (e.key === "Tab") {

            e.preventDefault();

            const textarea =
                textareaRef.current;

            const start =
                textarea.selectionStart;

            const end =
                textarea.selectionEnd;

            const updatedContent =
                content.substring(0, start) +
                "    " +
                content.substring(end);

            setContent(updatedContent);

            // RESTORE CURSOR POSITION
            setTimeout(() => {

                textarea.selectionStart =
                    textarea.selectionEnd =
                    start + 4;

            }, 0);
        }

        // SAVE FILE USING CTRL + S
        if (e.ctrlKey && e.key === "s") {

            e.preventDefault();

            if (onSave) onSave();
        }
    };



    return (
        <div className={`h-full flex flex-col transition-all duration-500 rounded-[inherit] ${isGenerating ? 'animated-border-wrapper' : 'bg-[#0d1117] overflow-hidden'}`}>
            <div className={`flex-1 flex flex-col transition-all duration-500 ${isGenerating ? 'animated-border-content' : 'overflow-hidden'}`}>
            {/* REVIEW BANNER */}
            {isReviewing && (
                <div className="bg-blue-500/10 border-b border-blue-500/30 px-6 py-3 flex items-center justify-between text-blue-400 text-sm font-medium z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        AI Code Generated!
                    </div>
                    <div className="flex gap-4 opacity-80">
                        <span>Press <kbd className="px-2 py-0.5 rounded bg-[#161b22] border border-blue-500/30 font-mono text-xs">Tab</kbd> to accept</span>
                        <span>Press <kbd className="px-2 py-0.5 rounded bg-[#161b22] border border-gray-700 font-mono text-xs text-gray-400">Esc</kbd> to reject</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                {/* LINE NUMBERS */}
                <div
                    ref={lineNumberRef}
                    className={`w-[70px] border-r border-gray-800 text-gray-500 text-right py-6 px-3 overflow-hidden select-none font-mono text-[15px] leading-8 ${isGenerating ? 'bg-transparent' : 'bg-[#161b22]'}`}
                >

                    {
                        lineNumbers.map((line) => (

                            <div key={line}>

                                {line}

                            </div>
                        ))
                    }

                </div>

                {/* EDITOR */}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    readOnly={isReviewing}
                    placeholder="Start writing code..."
                    className={`flex-1 py-6 px-6 outline-none resize-none overflow-auto font-mono text-[15px] leading-8 custom-scrollbar transition-colors ${
                        isReviewing ? 'text-gray-500 selection:bg-transparent' : 'text-white'
                    } ${isGenerating ? 'bg-transparent' : 'bg-[#0d1117]'}`}
                    style={{
                        minHeight: "100%",
                        whiteSpace: "pre",
                        tabSize: 4
                    }}
                />
            </div>
            </div>
        </div>
    );
};

export default CodeEditor;