import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import FileExplorer from "../components/file/FileExplorer";

import FileToolbar from "../components/file/FileToolbar";

import CodeEditor from "../components/file/CodeEditor";

import EmptyEditorState from "../components/file/EmptyEditorState";

import CreateFileModal from "../components/file/CreateFileModal";

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
    getFileById
} from "../api/fileApi";

const FilesPage = () => {

    const { repoId } = useParams();
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

    if (loading) {

        return (

            <DashboardLayout>

                <Loader text="Loading files..." />

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            {/* Back Button */}
            <div className="mb-4">
                <Link 
                    to={`/repository/${repoId}`}
                    className="text-gray-400 hover:text-white transition flex items-center gap-2 text-sm w-fit"
                >
                    <span>←</span> Back to Repository Overview
                </Link>
            </div>

            <div
                className="
                    h-[calc(100vh-112px)]
                    flex
                    overflow-hidden
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
                                        onOpenCommit={() =>
                                            setIsCommitModalOpen(true)
                                        }
                                    />

                                    {/* EDITOR */}
                                    <div className="flex-1 overflow-auto">

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

        </DashboardLayout>
    );
};

export default FilesPage;