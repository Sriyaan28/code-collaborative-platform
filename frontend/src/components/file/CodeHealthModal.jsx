import { useEffect, useState } from "react";

import { diffLines } from "diff";

import axiosInstance from "../../api/axios";
import { getFileById } from "../../api/fileApi";
import useModal from "../../hooks/useModal";

const CodeHealthModal = ({
    isOpen,
    onClose,
    fileId,
    onApplyEdits,
    onCreateIssue
}) => {

    const [loading, setLoading] = useState(false);
    const { showModal } = useModal();

    const [result, setResult] = useState(null);

    const [diffResult, setDiffResult] = useState([]);

    useEffect(() => {

        if (
            isOpen &&
            fileId
        ) {

            analyzeCode();
        }

    }, [isOpen]);

    const analyzeCode = async () => {

        try {

            setLoading(true);

            setResult(null);

            // Fetch fresh code from DB
            const fileData = await getFileById(fileId);
            const freshCode = fileData.payload?.file?.content || "";

            const response =
                await axiosInstance.post(
                    "/files/code-health",
                    {
                        code: freshCode
                    }
                );

            const aiResult =
                response.data.payload;

            setResult(aiResult);

            // DIFF
            const diff =
                diffLines(
                    freshCode,
                    aiResult.improvedCode || ""
                );

            setDiffResult(diff);

        }
        catch (err) {

            console.log(err);

            showModal(
                "Failed to analyze code",
                "error"
            );
        }
        finally {

            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 z-[100] bg-black/60 flex justify-end">

            <div
                className="
                    w-[700px]
                    h-full
                    bg-[#0f141b]
                    border-l
                    border-gray-800
                    flex
                    flex-col
                "
            >

                {/* HEADER */}
                <div
                    className="
                        h-[80px]
                        px-8
                        border-b
                        border-gray-800
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2 className="text-3xl font-bold">

                            AI Code Health

                        </h2>

                        <p className="text-gray-400 mt-1">

                            Analyze and improve your code

                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            w-11
                            h-11
                            rounded-xl
                            bg-[#161b22]
                            hover:bg-[#1f2937]
                            transition
                            text-xl
                        "
                    >
                        ✕
                    </button>

                </div>

                {
                    loading
                        ? (
                            <div className="flex-1 flex items-center justify-center text-xl text-gray-400">

                                Analyzing code...

                            </div>
                        )
                        : !result
                            ? (
                                <div className="flex-1 flex items-center justify-center text-xl text-gray-400">

                                    No analysis found

                                </div>
                            )
                            : (
                                <div
                                    className="
                                        flex-1
                                        overflow-y-auto
                                        custom-scrollbar
                                        p-8
                                    "
                                >

                                    {/* HEALTH SCORE */}
                                    <div className="mb-10">

                                        <div className="flex items-center justify-between mb-5">

                                            <h2 className="text-3xl font-bold">

                                                Code Health

                                            </h2>

                                            <div
                                                className="
                                                    w-24
                                                    h-24
                                                    rounded-full
                                                    border-4
                                                    border-blue-500
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-3xl
                                                    font-bold
                                                    text-blue-400
                                                "
                                            >

                                                {
                                                    result.codeHealth
                                                }

                                            </div>

                                        </div>

                                        <p className="text-gray-400 leading-8 text-lg">

                                            {
                                                result.summary
                                            }

                                        </p>

                                    </div>

                                    {/* METRICS */}
                                    <div className="grid grid-cols-2 gap-5 mb-10">

                                        <MetricCard
                                            title="Performance"
                                            value={result.performanceScore}
                                        />

                                        <MetricCard
                                            title="Readability"
                                            value={result.readabilityScore}
                                        />

                                        <MetricCard
                                            title="Maintainability"
                                            value={result.maintainabilityScore}
                                        />

                                        <MetricCard
                                            title="Security"
                                            value={result.securityScore}
                                        />

                                        <MetricCard
                                            title="Scalability"
                                            value={result.scalabilityScore}
                                        />

                                        <MetricCard
                                            title="Tech Debt"
                                            value={result.techDebt}
                                        />

                                    </div>

                                    {/* STRENGTHS */}
                                    <Section
                                        title="Strengths"
                                        items={result.strengths}
                                        color="text-green-400"
                                    />

                                    {/* ISSUES */}
                                    <Section
                                        title="Issues"
                                        items={result.issues}
                                        color="text-red-400"
                                        onCreateIssue={onCreateIssue}
                                    />

                                    {/* SUGGESTIONS */}
                                    <Section
                                        title="Suggestions"
                                        items={result.suggestions}
                                        color="text-blue-400"
                                    />

                                    {/* DIFF VIEW */}
                                    <div className="mt-14">

                                        <div className="flex items-center justify-between mb-6">

                                            <h2 className="text-3xl font-bold">

                                                AI Improvements

                                            </h2>

                                            <button
                                                onClick={() =>
                                                    onApplyEdits(
                                                        result.improvedCode
                                                    )
                                                }
                                                className="
                                                    px-6
                                                    py-3
                                                    rounded-2xl
                                                    bg-green-500
                                                    hover:bg-green-400
                                                    transition
                                                    text-black
                                                    font-semibold
                                                "
                                            >
                                                Apply Edits
                                            </button>

                                        </div>

                                        <div
                                            className="
                                                bg-[#0d1117]
                                                border
                                                border-gray-800
                                                rounded-3xl
                                                overflow-hidden
                                            "
                                        >

                                            <pre
                                                className="
                                                    p-6
                                                    overflow-x-auto
                                                    text-sm
                                                    leading-7
                                                    font-mono
                                                "
                                            >

                                                {
                                                    diffResult.map(
                                                        (
                                                            part,
                                                            index
                                                        ) => {

                                                            let color =
                                                                "text-gray-300";

                                                            if (
                                                                part.added
                                                            ) {

                                                                color =
                                                                    "text-green-400 bg-green-500/10";
                                                            }

                                                            if (
                                                                part.removed
                                                            ) {

                                                                color =
                                                                    "text-red-400 bg-red-500/10";
                                                            }

                                                            return (

                                                                <span
                                                                    key={index}
                                                                    className={color}
                                                                >

                                                                    {
                                                                        part.value
                                                                    }

                                                                </span>
                                                            );
                                                        }
                                                    )
                                                }

                                            </pre>

                                        </div>

                                    </div>

                                </div>
                            )
                }

            </div>

        </div>
    );
};

// METRIC CARD
const MetricCard = ({
    title,
    value
}) => {

    return (

        <div
            className="
                bg-[#161b22]
                border
                border-gray-800
                rounded-2xl
                p-5
            "
        >

            <p className="text-gray-400 text-sm mb-3">

                {title}

            </p>

            <h3 className="text-3xl font-bold text-blue-400">

                {value}

            </h3>

        </div>
    );
};

// SECTION
const Section = ({
    title,
    items,
    color,
    onCreateIssue
}) => {

    if (!items?.length) return null;

    return (

        <div className="mb-10">

            <h2
                className={`
                    text-2xl
                    font-bold
                    mb-5
                    ${color}
                `}
            >

                {title}

            </h2>

            <div className="space-y-4">

                {
                    items.map(
                        (item, index) => (

                                <div
                                    key={index}
                                    className="
                                        bg-[#161b22]
                                        border
                                        border-gray-800
                                        rounded-2xl
                                        p-5
                                        leading-7
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <div className="flex-1">
                                        {item}
                                    </div>
                                    {onCreateIssue && (
                                        <button
                                            onClick={() => onCreateIssue(item)}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm transition shrink-0"
                                        >
                                            Create Issue
                                        </button>
                                    )}
                                </div>
                        )
                    )
                }

            </div>

        </div>
    );
};

export default CodeHealthModal;