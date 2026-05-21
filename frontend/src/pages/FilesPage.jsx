import { useEffect, useState, useRef } from "react";

import { useParams, Link, useOutletContext } from "react-router-dom";

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

import useModal from "../hooks/useModal";

import {
    getBranches
} from "../api/branchApi";

import {
    getBranchFiles,
    updateFile,
    deleteFile,
    getFileById,
    generateCode
} from "../api/fileApi";

const FilesPage = () => {

    const { repoId } = useParams();
    const { repository } = useOutletContext();
    const { showModal } = useModal();

    const [branches, setBranches] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("");

    const [files, setFiles] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [editorLoading, setEditorLoading] =
        useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const [isCommitModalOpen, setIsCommitModalOpen] =
        useState(false);

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    const [explorerWidth, setExplorerWidth] =
        useState(320);

    const [isCodeHealthOpen, setIsCodeHealthOpen] =
        useState(false);

    const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] =
        useState(false);
        
    const [issueInitialData, setIssueInitialData] = 
        useState(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [originalContent, setOriginalContent] = useState("");
    
    const typeWriterRef = useRef(null);
    const fullAiCodeRef = useRef("");

    // ESCAPE FULLSCREEN
    useEffect(() => {

        const handleKeyDown = (e) => {

            if (e.key === "Escape") {

                setIsFullscreen(false);
            }

            // CTRL + S
            if (
                e.ctrlKey &&
                e.key === "s"
            ) {

                e.preventDefault();

                handleSaveFile();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [selectedFile, content]);

    // FETCH BRANCHES
    const fetchBranches = async () => {

        try {

            const data =
                await getBranches(repoId);

            const branchData =
                data.payload || [];

            setBranches(branchData);

            if (branchData.length > 0) {

                setSelectedBranch(
                    branchData[0]._id
                );

            } else {

                setLoading(false);
            }

        }
        catch (err) {

            console.log(err);

            setLoading(false);
        }
    };

    // FETCH FILES
    const fetchFiles = async (preserveEditorState = false) => {

        if (!selectedBranch) return;

        try {

            if (!preserveEditorState) {
                // IMPORTANT FIX
                // CLEAR OLD EDITOR STATE
                setSelectedFile(null);

                setContent("");
            }

            setEditorLoading(true);

            const data =
                await getBranchFiles(
                    repoId,
                    selectedBranch
                );

            const fetchedFiles =
                (data.payload || []).filter(file => !file.isDeleted);

            setFiles(fetchedFiles);

        }
        catch (err) {

            console.log(err);
        }
        finally {

            setLoading(false);

            setEditorLoading(false);
        }
    };

    useEffect(() => {

        fetchBranches();

    }, []);

    useEffect(() => {

        fetchFiles();

    }, [selectedBranch]);

    // FETCH FILE CONTENT
    useEffect(() => {

        const fetchContent = async () => {

            if (!selectedFile) return;

            try {

                setContent("");

                setEditorLoading(true);

                const data =
                    await getFileById(
                        selectedFile._id
                    );

                setContent(
                    data.payload?.file?.content || ""
                );

            }
            catch (err) {

                console.log(err);
            }
            finally {

                setEditorLoading(false);
            }
        };

        fetchContent();

    }, [selectedFile]);

    // SAVE FILE
    const handleSaveFile = async () => {

        if (!selectedFile) return;

        try {

            setSaving(true);

            const res = await updateFile({
                fileId:
                    selectedFile._id,

                repoId,

                content
            });

            showModal(res.message, "success");

            fetchFiles(true);

        }
        catch (err) {

            console.log(err);

            showModal(
                "Failed to save file",
                "error"
            );
        }
        finally {

            setSaving(false);
        }
    };

    // DELETE FILE
    const handleDeleteFile = async () => {

        if (!selectedFile) return;

        const confirmDelete =
            confirm(
                "Delete this file?"
            );

        if (!confirmDelete) return;

        try {

            const res = await deleteFile(
                selectedFile._id,
                repoId
            );

            showModal(res.message, "success");

            setSelectedFile(null);

            setContent("");

            fetchFiles();

        }
        catch (err) {

            console.log(err);

            showModal(
                "Failed to delete file",
                "error"
            );
        }
    };

    // CHANGED FILES ONLY
    const changedFiles =
        files.filter(
            (file) =>
                file.old_content !== file.content
        );

    // AI CODE GENERATION
    const handleGenerateCode = async (prompt) => {
        if (!selectedFile) return;

        try {
            setOriginalContent(content);
            setIsFullscreen(true);
            setIsGenerating(true);
            setIsReviewing(true); // Show banner early

            const data = await generateCode(prompt, content);
            const aiCode = data.payload?.generatedCode || "";

            if (!aiCode) throw new Error("No code generated");

            fullAiCodeRef.current = aiCode;
            setContent("");
            
            let i = 0;
            typeWriterRef.current = setInterval(() => {
                if (i < aiCode.length) {
                    setContent((prev) => prev + aiCode.charAt(i));
                    i++;
                } else {
                    if (typeWriterRef.current) clearInterval(typeWriterRef.current);
                }
            }, 10);

        } catch (err) {
            console.log("AI Generation error", err);
            showModal("Failed to generate code", "error");
            setIsGenerating(false);
            setIsReviewing(false);
        }
    };

    const handleAcceptCode = () => {
        if (typeWriterRef.current) clearInterval(typeWriterRef.current);
        if (fullAiCodeRef.current) setContent(fullAiCodeRef.current);
        setIsReviewing(false);
        setIsGenerating(false);
    };

    const handleRejectCode = () => {
        if (typeWriterRef.current) clearInterval(typeWriterRef.current);
        setContent(originalContent);
        setIsReviewing(false);
        setIsGenerating(false);
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
                                    <div className={`flex-1 overflow-hidden transition-all duration-300 relative ${isGenerating ? 'p-[2px] animated-border-wrapper rounded-none' : ''}`}>

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
                            onGenerate={handleGenerateCode} 
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