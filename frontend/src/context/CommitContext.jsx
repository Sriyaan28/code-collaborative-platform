import { createContext, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getRepoCommits, getCommitById, rollbackCommit } from "../api/commitApi";

export const CommitContext = createContext();

export const CommitProvider = ({ children }) => {
    const { repoId } = useParams();
    const { showModal } = useModal();

    const [commits, setCommits] = useState([]);
    const [commitData, setCommitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rollingBack, setRollingBack] = useState(null);

    const initialFetchDone = useRef(false);
    const currentRepoRef = useRef(repoId);

    const initialCommitFetchDone = useRef(false);
    const currentCommitRef = useRef(null);

    const fetchCommits = useCallback(async () => {
        if (!repoId) return;

        if (currentRepoRef.current !== repoId) {
            setCommits([]);
            initialFetchDone.current = false;
            currentRepoRef.current = repoId;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const data = await getRepoCommits(repoId);
            setCommits(data.payload || []);
            initialFetchDone.current = true;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [repoId]);

    const fetchCommit = useCallback(async (commitId) => {
        if (!commitId) return;

        if (currentCommitRef.current !== commitId) {
            setCommitData(null);
            initialCommitFetchDone.current = false;
            currentCommitRef.current = commitId;
        }

        try {
            if (!initialCommitFetchDone.current) setLoading(true);
            const data = await getCommitById(commitId);
            setCommitData(data.payload);
            initialCommitFetchDone.current = true;
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRollback = useCallback(async (commitId) => {
        const confirmRollback = window.confirm("Rollback repository to this commit?");
        if (!confirmRollback) return;
        try {
            setRollingBack(commitId);
            const res = await rollbackCommit({ repository: repoId, commitId });
            showModal(res.message, "success");
            fetchCommits();
        } catch (err) {
            console.log(err);
            showModal(err.response?.data?.message || "Failed to rollback commit", "error");
        } finally {
            setRollingBack(null);
        }
    }, [repoId, showModal, fetchCommits]);

    const value = useMemo(() => ({
        commits,
        commitData,
        loading,
        rollingBack,
        fetchCommits,
        fetchCommit,
        handleRollback
    }), [commits, commitData, loading, rollingBack, fetchCommits, fetchCommit, handleRollback]);

    return (
        <CommitContext.Provider value={value}>
            {children}
        </CommitContext.Provider>
    );
};
