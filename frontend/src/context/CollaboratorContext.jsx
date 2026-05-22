import { createContext, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getCollaborators, removeCollaborator } from "../api/collaboratorApi";

export const CollaboratorContext = createContext();

export const CollaboratorProvider = ({ children }) => {
    const { repoId } = useParams();
    const { showModal } = useModal();

    const [collaborators, setCollaborators] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialFetchDone = useRef(false);
    const currentRepoRef = useRef(repoId);

    const fetchCollaborators = useCallback(async () => {
        if (!repoId) return;

        if (currentRepoRef.current !== repoId) {
            setCollaborators([]);
            setBlockedUsers([]);
            initialFetchDone.current = false;
            currentRepoRef.current = repoId;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const data = await getCollaborators(repoId);
            setCollaborators(data.payload?.collaborators || []);
            setBlockedUsers(data.payload?.blockedUsers || []);
            initialFetchDone.current = true;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [repoId]);

    const handleRemove = useCallback(async (collabId) => {
        const confirmRemove = window.confirm("Remove collaborator?");
        if (!confirmRemove) return;

        try {
            const res = await removeCollaborator(collabId);
            showModal(res.message, "success");
            fetchCollaborators();
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to remove collaborator", "error");
        }
    }, [fetchCollaborators, showModal]);

    const value = useMemo(() => ({
        collaborators,
        blockedUsers,
        loading,
        fetchCollaborators,
        handleRemove
    }), [collaborators, blockedUsers, loading, fetchCollaborators, handleRemove]);

    return (
        <CollaboratorContext.Provider value={value}>
            {children}
        </CollaboratorContext.Provider>
    );
};
