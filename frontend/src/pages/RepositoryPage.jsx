import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useRepository from "../hooks/useRepository";
import { getMainBranchFiles, getFileById } from "../api/fileApi";
import { updateRepository } from "../api/repositoryApi";
import useModal from "../hooks/useModal";

const RepositoryPage = () => {
    const { repository, fetchRepository } = useRepository();
    const { showModal } = useModal();

    const [readmeFiles, setReadmeFiles] = useState([]);
    const [selectedReadme, setSelectedReadme] = useState("");
    const [readmeContent, setReadmeContent] = useState("");
    const [loadingReadme, setLoadingReadme] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (repository) {
            setSelectedReadme(repository.mainReadmeFile || "");
        }
    }, [repository]);

    // Fetch main branch files for owner to select README
    useEffect(() => {
        if (repository?.currentUserRole === 'owner') {
            const fetchFiles = async () => {
                try {
                    const res = await getMainBranchFiles(repository._id);
                    if (res.success && res.payload) {
                        const readmes = res.payload.filter(file => /^readme\.md$/i.test(file.name) && !file.isDeleted);
                        setReadmeFiles(readmes);
                    }
                } catch (err) {
                    console.error("Failed to fetch files for readme selection", err);
                }
            };
            fetchFiles();
        }
    }, [repository]);

    // Fetch content of the selected README file
    useEffect(() => {
        if (repository?.mainReadmeFile) {
            const fetchContent = async () => {
                setLoadingReadme(true);
                try {
                    const res = await getFileById(repository.mainReadmeFile);
                    if (res.success && res.payload?.file) {
                        setReadmeContent(res.payload.file.content || "");
                    }
                } catch (err) {
                    console.error("Failed to fetch readme content", err);
                } finally {
                    setLoadingReadme(false);
                }
            };
            fetchContent();
        } else {
            setReadmeContent("");
        }
    }, [repository?.mainReadmeFile]);

    const handleSelectReadme = async (e) => {
        const fileId = e.target.value;
        setSelectedReadme(fileId);

        setSaving(true);
        try {
            const res = await updateRepository(repository._id, { mainReadmeFile: fileId || null });
            if (res.success) {
                showModal("Main README updated", "success");
                await fetchRepository();
            }
        } catch (err) {
            console.error(err);
            showModal(err.response?.data?.message || "Failed to update README", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!repository) return null;

    return (
        <div className="space-y-10">
            {/* Existing Info Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">
                    <h2 className="text-2xl font-semibold mb-5">
                        Repository Info
                    </h2>
                    <div className="space-y-4 text-gray-400">
                        <p>
                            <span className="text-white">Repository ID:</span>{" "}
                            {repository._id}
                        </p>
                        <p>
                            <span className="text-white">Visibility:</span>{" "}
                            {repository.visibility}
                        </p>
                    </div>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6">
                    <h2 className="text-2xl font-semibold mb-5">
                        Details
                    </h2>
                    <div className="space-y-4 text-gray-400">
                        <p>
                            <span className="text-white">Owner:</span>{" "}
                            {repository.owner?.name || "Unknown"}
                        </p>
                        <p>
                            <span className="text-white">Created At:</span>{" "}
                            {new Date(repository.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                            <span className="text-white">Updated At:</span>{" "}
                            {new Date(repository.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* README Section */}
            {(repository.currentUserRole === 'owner' || repository.mainReadmeFile) && (
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                            README.md
                        </h2>

                        {repository.currentUserRole === 'owner' && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Main README:</span>
                                <select
                                    value={selectedReadme}
                                    onChange={handleSelectReadme}
                                    disabled={saving}
                                    className="p-2 rounded-lg bg-[#0d1117] border border-gray-700 outline-none text-sm min-w-[200px]"
                                >
                                    <option value="">-- None Selected --</option>
                                    {readmeFiles.map(file => (
                                        <option key={file._id} value={file._id}>
                                            {file.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-8 min-h-[200px]">
                        {loadingReadme ? (
                            <div className="flex items-center justify-center h-40 text-gray-400">
                                Loading README...
                            </div>
                        ) : !repository.mainReadmeFile ? (
                            <div className="flex items-center justify-center h-40 text-gray-500 italic">
                                No README file selected.
                            </div>
                        ) : readmeContent ? (
                            <div className="prose prose-invert max-w-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-gray-800 prose-a:text-blue-400 hover:prose-a:text-blue-300">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {readmeContent}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-gray-500 italic">
                                This README file is empty.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepositoryPage;