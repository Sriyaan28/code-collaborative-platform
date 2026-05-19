import { useEffect, useMemo, useRef } from "react";

const CodeEditor = ({
    content,
    setContent,
    onSave
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

        <div className="h-full flex bg-[#0d1117] overflow-hidden">

            {/* LINE NUMBERS */}
            <div
                ref={lineNumberRef}
                className="w-[70px] bg-[#161b22] border-r border-gray-800 text-gray-500 text-right py-6 px-3 overflow-hidden select-none font-mono text-[15px] leading-8"
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
                placeholder="Start writing code..."
                className="flex-1 bg-[#0d1117] text-white py-6 px-6 outline-none resize-none overflow-auto font-mono text-[15px] leading-8 custom-scrollbar"
                style={{
                    minHeight: "100%",
                    whiteSpace: "pre",
                    tabSize: 4
                }}
            />

        </div>
    );
};

export default CodeEditor;