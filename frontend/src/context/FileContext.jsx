import { createContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getBranches } from "../api/branchApi";
import { getBranchFiles, updateFile, deleteFile, getFileById, generateCode, smartMergeCode } from "../api/fileApi";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const { repoId } = useParams();
    const { showModal } = useModal();

    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editorLoading, setEditorLoading] = useState(false);
    const [isSyncingContent, setIsSyncingContent] = useState(false);
    const [conflictData, setConflictData] = useState(null);

    // AI state
    const [isGenerating, setIsGenerating] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [originalContent, setOriginalContent] = useState("");
    
    const typeWriterRef = useRef(null);
    const fullAiCodeRef = useRef("");

    // FETCH BRANCHES
    const fetchBranches = useCallback(async () => {
        try {
            const data = await getBranches(repoId);
            const branchData = data.payload || [];
            setBranches(branchData);
            
            if (branchData.length > 0) {
                // If we don't have a selected branch, or the currently selected branch doesn't exist anymore
                setSelectedBranch(current => {
                    const branchExists = branchData.find(b => b._id === current);
                    return branchExists ? current : branchData[0]._id;
                });
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }, [repoId]);

    const initialFetchDone = useRef(false);
    const currentBranchRef = useRef(selectedBranch);
    const fileCache = useRef({});

    const isGeneratingRef = useRef(isGenerating);
    const isReviewingRef = useRef(isReviewing);
    const isSmartMergeRef = useRef(false);
    
    useEffect(() => {
        isGeneratingRef.current = isGenerating;
        isReviewingRef.current = isReviewing;
    }, [isGenerating, isReviewing]);

    // FETCH FILES
    const fetchFiles = useCallback(async (preserveEditorState = false) => {
        if (!selectedBranch) return;

        if (currentBranchRef.current !== selectedBranch) {
            if (!preserveEditorState) {
                setFiles([]);
                setSelectedFile(null);
                setContent("");
            }
            initialFetchDone.current = false;
            currentBranchRef.current = selectedBranch;
        }

        try {
            if (!initialFetchDone.current) setEditorLoading(true);
            const data = await getBranchFiles(repoId, selectedBranch);
            const fetchedFiles = (data.payload || []).filter(file => !file.isDeleted);
            setFiles(fetchedFiles);
            initialFetchDone.current = true;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setEditorLoading(false);
        }
    }, [repoId, selectedBranch]);

    useEffect(() => {
        if (repoId) {
            fetchBranches();
        }
    }, [repoId, fetchBranches]);

    useEffect(() => {
        if (selectedBranch) {
            fetchFiles();
        }
    }, [selectedBranch, fetchFiles]);

    // FETCH FILE CONTENT
    useEffect(() => {
        const fetchContent = async () => {
            if (!selectedFile) return;
            const fileId = selectedFile._id;

            if (fileCache.current[fileId] !== undefined) {
                setContent(fileCache.current[fileId]);
                // Silently fetch without loader
                setIsSyncingContent(true);
            } else {
                setContent("");
                setEditorLoading(true);
            }

            try {
                const data = await getFileById(fileId);
                const freshContent = data.payload?.file?.content || "";
                
                // Only update if user hasn't switched away and AI is not active
                if (!isGeneratingRef.current && !isReviewingRef.current) {
                    fileCache.current[fileId] = freshContent;
                    
                    // If the user hasn't typed/changed the state to something else, or if we want to ensure latest
                    // We only update if we are still on the same file
                    setContent((prevContent) => {
                         // Simple SWR: replace content with fresh DB content
                         return freshContent;
                    });
                }
            } catch (err) {
                console.log(err);
            } finally {
                setEditorLoading(false);
                setIsSyncingContent(false);
            }
        };
        fetchContent();
    }, [selectedFile]);

    // SAVE FILE
    const handleSaveFile = useCallback(async () => {
        if (!selectedFile) return;
        try {
            setSaving(true);

            const data = await getFileById(selectedFile._id);
            const freshContent = data.payload?.file?.content || "";
            const oldLoadedContent = fileCache.current[selectedFile._id];

            if (freshContent !== oldLoadedContent && oldLoadedContent !== undefined) {
                setSaving(false);
                setConflictData({
                    oldContent: oldLoadedContent,
                    fetchedContent: freshContent
                });
                return;
            }

            const res = await updateFile({
                fileId: selectedFile._id,
                repoId,
                content
            });
            showModal(res.message, "success");
            fileCache.current[selectedFile._id] = content;
            fetchFiles(true);
        } catch (err) {
            console.log(err);
            showModal("Failed to save file", "error");
        } finally {
            setSaving(false);
        }
    }, [selectedFile, repoId, content, fetchFiles, showModal]);

    const handleForceSave = useCallback(async () => {
        if (!selectedFile) return;
        try {
            setSaving(true);
            setConflictData(null);
            const res = await updateFile({
                fileId: selectedFile._id,
                repoId,
                content
            });
            showModal(res.message, "success");
            fileCache.current[selectedFile._id] = content;
            fetchFiles(true);
        } catch (err) {
            console.log(err);
            showModal("Failed to force save file", "error");
        } finally {
            setSaving(false);
        }
    }, [selectedFile, repoId, content, fetchFiles, showModal]);

    const handleSmartMerge = useCallback(async () => {
        if (!selectedFile || !conflictData) return;
        try {
            setOriginalContent(content);
            const latestBackendContent = conflictData.fetchedContent;
            setConflictData(null);
            isSmartMergeRef.current = true;
            setIsGenerating(true);
            setIsReviewing(true);

            const data = await smartMergeCode(content, latestBackendContent);
            const aiCode = data.payload?.mergedCode || "";

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
            console.log("Smart Merge AI error", err);
            showModal("Failed to merge code", "error");
            setIsGenerating(false);
            setIsReviewing(false);
        }
    }, [selectedFile, content, conflictData, showModal]);

    // DELETE FILE
    const handleDeleteFile = useCallback(async () => {
        if (!selectedFile) return;
        const confirmDelete = window.confirm("Delete this file?");
        if (!confirmDelete) return;

        try {
            const res = await deleteFile(selectedFile._id, repoId);
            showModal(res.message, "success");
            setSelectedFile(null);
            setContent("");
            fetchFiles();
        } catch (err) {
            console.log(err);
            showModal("Failed to delete file", "error");
        }
    }, [selectedFile, repoId, fetchFiles, showModal]);

    // AI CODE GENERATION
    const handleGenerateCode = useCallback(async (prompt, setIsFullscreen) => {
        if (!selectedFile) return;
        try {
            setOriginalContent(content);
            if (setIsFullscreen) setIsFullscreen(true);
            setIsGenerating(true);
            setIsReviewing(true);

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
    }, [selectedFile, content, showModal]);

    const handleAcceptCode = useCallback(async () => {
        if (typeWriterRef.current) clearInterval(typeWriterRef.current);
        const finalCode = fullAiCodeRef.current;
        if (finalCode) {
            setContent(finalCode);
            if (isSmartMergeRef.current && selectedFile) {
                try {
                    setSaving(true);
                    const res = await updateFile({
                        fileId: selectedFile._id,
                        repoId,
                        content: finalCode
                    });
                    showModal("Smart Merge saved successfully", "success");
                    fileCache.current[selectedFile._id] = finalCode;
                    fetchFiles(true);
                } catch (err) {
                    console.log(err);
                    showModal("Failed to save merged file", "error");
                } finally {
                    setSaving(false);
                }
            }
        }
        isSmartMergeRef.current = false;
        setIsReviewing(false);
        setIsGenerating(false);
    }, [selectedFile, repoId, fetchFiles, showModal]);

    const handleRejectCode = useCallback(() => {
        if (typeWriterRef.current) clearInterval(typeWriterRef.current);
        setContent(originalContent);
        isSmartMergeRef.current = false;
        setIsReviewing(false);
        setIsGenerating(false);
    }, [originalContent]);

    const value = useMemo(() => ({
        branches,
        selectedBranch,
        setSelectedBranch,
        files,
        selectedFile,
        setSelectedFile,
        content,
        setContent,
        loading,
        saving,
        editorLoading,
        isGenerating,
        isReviewing,
        isSyncingContent,
        originalContent,
        conflictData,
        setConflictData,
        fetchBranches,
        fetchFiles,
        handleSaveFile,
        handleForceSave,
        handleSmartMerge,
        handleDeleteFile,
        handleGenerateCode,
        handleAcceptCode,
        handleRejectCode
    }), [
        branches, selectedBranch, files, selectedFile, content, loading, saving, editorLoading,
        isGenerating, isReviewing, isSyncingContent, originalContent, conflictData, fetchBranches, fetchFiles, handleSaveFile,
        handleForceSave, handleSmartMerge, handleDeleteFile, handleGenerateCode, handleAcceptCode, handleRejectCode
    ]);

    return (
        <FileContext.Provider value={value}>
            {children}
        </FileContext.Provider>
    );
};
