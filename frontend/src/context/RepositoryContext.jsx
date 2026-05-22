import { createContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRepositoryById, deleteRepository } from "../api/repositoryApi";
import useModal from "../hooks/useModal";

export const RepositoryContext = createContext();

export const RepositoryProvider = ({ children }) => {
    const { repoId } = useParams();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [repository, setRepository] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const initialFetchDone = useRef(false);
    const currentRepoRef = useRef(repoId);

    const fetchRepository = useCallback(async () => {
        if (!repoId) return;

        if (currentRepoRef.current !== repoId) {
            setRepository(null);
            initialFetchDone.current = false;
            currentRepoRef.current = repoId;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const data = await getRepositoryById(repoId);
            setRepository({ ...data.payload, currentUserRole: data.role });
            initialFetchDone.current = true;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [repoId]);

    useEffect(() => {
        if (repoId) {
            fetchRepository();
        }
    }, [repoId, fetchRepository]);

    const handleDeleteRepo = useCallback(async () => {
        if (!repository) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${repository.name}? This action cannot be undone.`);
        if (!confirmDelete) return;

        try {
            setDeleting(true);
            const res = await deleteRepository(repoId);
            showModal(res.message || "Repository deleted successfully", "success");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            showModal(err.response?.data?.message || "Failed to delete repository", "error");
            setDeleting(false);
        }
    }, [repoId, repository, navigate, showModal]);

    const value = useMemo(() => ({
        repoId,
        repository,
        loading,
        deleting,
        fetchRepository,
        handleDeleteRepo
    }), [repoId, repository, loading, deleting, fetchRepository, handleDeleteRepo]);

    return (
        <RepositoryContext.Provider value={value}>
            {children}
        </RepositoryContext.Provider>
    );
};
