import { createContext, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getBranches, createBranch, deleteBranch } from "../api/branchApi";

export const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const { repoId } = useParams();
    const { showModal } = useModal();

    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const initialFetchDone = useRef(false);
    const currentRepoRef = useRef(repoId);

    const fetchBranches = useCallback(async () => {
        if (!repoId) return;

        if (currentRepoRef.current !== repoId) {
            setBranches([]);
            initialFetchDone.current = false;
            currentRepoRef.current = repoId;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const data = await getBranches(repoId);
            setBranches(data.payload || []);
            initialFetchDone.current = true;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [repoId]);

    const handleCreateBranch = useCallback(async (branchName) => {
        if (!branchName.trim()) return;
        try {
            setCreating(true);
            const res = await createBranch({ name: branchName, repoId });
            showModal(res.message, "success");
            fetchBranches();
            return true; // success
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to create branch", "error");
            return false;
        } finally {
            setCreating(false);
        }
    }, [repoId, fetchBranches, showModal]);

    const handleDeleteBranch = useCallback(async (branchId) => {
        const confirmDelete = window.confirm("Delete this branch?");
        if (!confirmDelete) return;

        try {
            const res = await deleteBranch(repoId, branchId);
            showModal(res.message, "success");
            fetchBranches();
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete branch", "error");
        }
    }, [repoId, fetchBranches, showModal]);

    const value = useMemo(() => ({
        branches,
        loading,
        creating,
        fetchBranches,
        handleCreateBranch,
        handleDeleteBranch
    }), [branches, loading, creating, fetchBranches, handleCreateBranch, handleDeleteBranch]);

    return (
        <BranchContext.Provider value={value}>
            {children}
        </BranchContext.Provider>
    );
};
