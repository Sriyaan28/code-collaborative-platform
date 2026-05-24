import { useState } from "react";

const ChangesDetectedModal = ({ isOpen, onClose, onForceSave, onSmartMerge, oldContent, fetchedContent }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#161b22] border border-gray-700 rounded-xl p-6 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <span className="text-yellow-500">⚠️</span> Changes Detected in File
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-4 text-gray-300 text-sm shrink-0">
                    Someone else has modified this file since you opened it. Saving now will overwrite their changes.
                    Please review the difference below.
                </div>

                <div className="flex-1 flex flex-col gap-4 overflow-hidden mb-6">
                    <div className="flex-1 flex flex-col overflow-hidden border border-gray-700 rounded-lg">
                        <div className="bg-[#0d1117] border-b border-gray-700 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Old Loaded Content (What you started with)
                        </div>
                        <div className="flex-1 overflow-auto bg-[#0d1117] p-4">
                            <pre className="text-gray-300 font-mono text-sm m-0">
                                <code>{oldContent}</code>
                            </pre>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden border border-green-500/30 rounded-lg">
                        <div className="bg-[#0d1117] border-b border-green-500/30 px-4 py-2 text-xs font-medium text-green-400 uppercase tracking-wider">
                            New Remote Content (What someone else saved)
                        </div>
                        <div className="flex-1 overflow-auto bg-green-500/5 p-4">
                            <pre className="text-green-300 font-mono text-sm m-0">
                                <code>{fetchedContent}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onForceSave}
                        className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                    >
                        Save Anyway (Overwrite)
                    </button>
                    <button
                        onClick={onSmartMerge}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <span>✨</span> Smart Merge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangesDetectedModal;
