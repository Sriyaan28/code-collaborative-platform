import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import Loader from "../components/common/Loader";
import FileExplorer from "../components/file/FileExplorer";
import FileToolbar from "../components/file/FileToolbar";
import CodeEditor from "../components/file/CodeEditor";
import EmptyEditorState from "../components/file/EmptyEditorState";
import CreateFileModal from "../components/file/CreateFileModal";
import AICodeGenerator from "../components/file/AICodeGenerator";
import CodeHealthModal from "../components/file/CodeHealthModal";
import CreateIssueModal from "../components/issue/CreateIssueModal";
import CreateCommitModal from "../components/commit/CreateCommitModal";
import useFile from "../hooks/useFile";

const FilesPage = () => {
    const { repoId } = useParams();
    const { repository } = useOutletContext();
    
    const {
        branches, selectedBranch, setSelectedBranch, files, selectedFile, setSelectedFile,
        content, setContent, loading, saving, editorLoading, isGenerating, isReviewing,
        fetchFiles, handleSaveFile, handleDeleteFile, handleGenerateCode, handleAcceptCode, handleRejectCode
    } = useFile();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [explorerWidth, setExplorerWidth] = useState(320);
    const [isCodeHealthOpen, setIsCodeHealthOpen] = useState(false);
    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
    const [issueInitialData, setIssueInitialData] = useState(null);

    // ESCAPE FULLSCREEN
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsFullscreen(false);
            }
            // CTRL + S
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSaveFile();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedFile, content, handleSaveFile]);

    const onGenerateCodeSubmit = (prompt) => {
        handleGenerateCode(prompt, setIsFullscreen);
    };

    if (loading) {
        return <Loader text="Loading files..." />;
    }

    return (
        <div>
            <div
                className="
                    h-[calc(100vh-350px)]
                    min-h-[500px]
                    flex
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-800
                "
            >

                {/* FILE EXPLORER */}
                {
                    !isFullscreen && (

                        <FileExplorer
                            width={explorerWidth}
                            setWidth={setExplorerWidth}
                            branches={branches}
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                            files={files}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            onCreateFile={() =>
                                setIsCreateModalOpen(true)
                            }
                            onOpenCommit={() =>
                                setIsCommitModalOpen(true)
                            }
                            hideCreate={repository?.currentUserRole === 'viewer'}
                        />
                    )
                }

                {/* RIGHT SIDE */}
                <div
                    className={`
                        flex
                        flex-col
                        bg-[#0d1117]
                        transition-all
                        duration-300
                        overflow-hidden
                        ${isFullscreen
                            ? "fixed inset-0 z-50 h-screen w-screen"
                            : "flex-1"
                        }
                    `}
                >

                    {
                        selectedFile
                            ? (
                                <>

                                    {/* TOOLBAR */}
                                    <FileToolbar
                                        selectedFile={selectedFile}
                                        onSave={handleSaveFile}
                                        onDelete={handleDeleteFile}
                                        saving={saving}
                                        isFullscreen={isFullscreen}
                                        setIsFullscreen={setIsFullscreen}
                                        onOpenCodeHealth={() =>
                                            setIsCodeHealthOpen(true)
                                        }
                                    />

                                    {/* EDITOR */}
                                    <div className={`flex-1 min-h-0 transition-all duration-300 relative ${isGenerating ? 'p-8' : 'overflow-hidden'}`}>

                                        {
                                            editorLoading
                                                ? (
                                                    <div
                                                        className="
                                                            h-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-gray-400
                                                        "
                                                    >
                                                        <Loader
                                                            text="Loading file..."
                                                        />
                                                    </div>
                                                )
                                                : (
                                                    <CodeEditor
                                                        content={content}
                                                        setContent={setContent}
                                                        isGenerating={isGenerating}
                                                        isReviewing={isReviewing}
                                                        onAccept={handleAcceptCode}
                                                        onReject={handleRejectCode}
                                                    />
                                                )
                                        }

                                    </div>

                                </>
                            )
                            : (
                                <EmptyEditorState />
                            )
                    }

                    {selectedFile && !isReviewing && (
                        <AICodeGenerator
                            onGenerate={onGenerateCodeSubmit}
                            isGenerating={isGenerating}
                        />
                    )}

                </div>

            </div>

            {/* CREATE FILE MODAL */}
            <CreateFileModal
                isOpen={isCreateModalOpen}
                onClose={() =>
                    setIsCreateModalOpen(false)
                }
                onFileCreated={fetchFiles}
                repoId={repoId}
                branchId={selectedBranch}
            />

            {/* COMMIT MODAL */}
            <CreateCommitModal
                isOpen={isCommitModalOpen}
                onClose={() =>
                    setIsCommitModalOpen(false)
                }
                files={files}
                repository={repoId}
                onCommitCreated={fetchFiles}
            />

            {/* CODE HEALTH MODAL */}
            <CodeHealthModal
                isOpen={isCodeHealthOpen}
                onClose={() =>
                    setIsCodeHealthOpen(false)
                }
                code={content}
                onApplyEdits={(newCode) => {
                    setContent(newCode);
                    setIsCodeHealthOpen(false);
                }}
                onCreateIssue={(issueContent) => {
                    setIsCodeHealthOpen(false);
                    setIssueInitialData({
                        title: `Code Health Issue in ${selectedFile?.name || 'File'}`,
                        description: issueContent
                    });
                    setIsCreateIssueModalOpen(true);
                }}
            />

            {/* CREATE ISSUE MODAL */}
            <CreateIssueModal
                isOpen={isCreateIssueModalOpen}
                onClose={() => {
                    setIsCreateIssueModalOpen(false);
                    setIssueInitialData(null);
                }}
                onIssueCreated={() => {
                    // Do nothing or show a success message
                }}
                repoId={repoId}
                initialData={issueInitialData}
            />

        </div>
    );
};

export default FilesPage;