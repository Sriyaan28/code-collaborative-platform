import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import FileExplorer from "../components/file/FileExplorer";

import FileToolbar from "../components/file/FileToolbar";

import CodeEditor from "../components/file/CodeEditor";

import EmptyEditorState from "../components/file/EmptyEditorState";

import CreateFileModal from "../components/file/CreateFileModal";

import CodeHealthModal from "../components/file/CodeHealthModal";

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

    const [branches, setBranches] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState("");

    const [files, setFiles] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const [isFullscreen, setIsFullscreen] =
        useState(false);

    const [explorerWidth, setExplorerWidth] =
        useState(320);

    const [isCodeHealthOpen, setIsCodeHealthOpen] =
        useState(false);

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
    const fetchFiles = async () => {

        if (!selectedBranch) return;

        try {

            const data =
                await getBranchFiles(
                    repoId,
                    selectedBranch
                );

            setFiles(
                data.payload || []
            );

        }
        catch (err) {

            console.log(err);
        }
        finally {

            setLoading(false);
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
        };

        fetchContent();

    }, [selectedFile]);

    // SAVE FILE
    const handleSaveFile = async () => {

        if (!selectedFile) return;

        try {

            setSaving(true);

            await updateFile({
                fileId:
                    selectedFile._id,

                repoId,

                content
            });

            fetchFiles();

        }
        catch (err) {

            console.log(err);

            alert(
                "Failed to save file"
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

            await deleteFile(
                selectedFile._id
            );

            setSelectedFile(null);

            setContent("");

            fetchFiles();

        }
        catch (err) {

            console.log(err);

            alert(
                "Failed to delete file"
            );
        }
    };

    if (loading) {

        return (

            <DashboardLayout>

                <Loader text="Loading files..." />

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div
                className="
                    h-[calc(100vh-72px)]
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
                                    />

                                    {/* EDITOR */}
                                    <div className="flex-1 overflow-auto">

                                        <CodeEditor
                                            content={content}
                                            setContent={setContent}
                                        />

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
            />

        </DashboardLayout>
    );
};

export default FilesPage;