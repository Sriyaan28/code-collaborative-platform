import { createContext, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getAllPullRequests, getPullRequestById, updatePRStatus, deletePullRequest } from "../api/prApi";
import { getBranches } from "../api/branchApi";

export const PullRequestContext = createContext();

export const PullRequestProvider = ({ children }) => {
    const { repoId } = useParams();
    const { showModal } = useModal();
    const navigate = useNavigate();

    const [pullRequests, setPullRequests] = useState([]);
    const [branches, setBranches] = useState([]);
    const [pr, setPr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const initialFetchDone = useRef(false);
    const currentRepoRef = useRef(repoId);

    const initialPRFetchDone = useRef(false);
    const currentPRRef = useRef(null);

    const fetchPullRequests = useCallback(async () => {
        if (!repoId) return;

        if (currentRepoRef.current !== repoId) {
            setPullRequests([]);
            setBranches([]);
            initialFetchDone.current = false;
            currentRepoRef.current = repoId;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const [prRes, branchRes] = await Promise.all([
                getAllPullRequests(repoId),
                getBranches(repoId)
            ]);
            
            const payload = prRes.payload || {};
            setPullRequests([
                ...(payload.openPullRequests || []),
                ...(payload.mergedPullRequests || []),
                ...(payload.closedPullRequests || [])
            ]);
            setBranches(branchRes.payload || []);
            initialFetchDone.current = true;
        } catch (err) {
            showModal("Failed to fetch pull requests", "error");
        } finally {
            setLoading(false);
        }
    }, [repoId, showModal]);

    const fetchPR = useCallback(async (prId) => {
        if (!prId) return;

        if (currentPRRef.current !== prId) {
            setPr(null);
            initialPRFetchDone.current = false;
            currentPRRef.current = prId;
        }

        try {
            if (!initialPRFetchDone.current) setLoading(true);
            setErrorMsg(null);
            const res = await getPullRequestById(prId);
            setPr(res.payload);
            initialPRFetchDone.current = true;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch pull request details";
            setErrorMsg(msg);
            showModal(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [showModal]);

    const handleUpdateStatus = useCallback(async (prId, status) => {
        try {
            setActionLoading(true);
            const res = await updatePRStatus(prId, status);
            showModal(res.message, "success");
            fetchPR(prId);
        } catch (err) {
            showModal(err.response?.data?.message || `Failed to ${status} pull request`, "error");
        } finally {
            setActionLoading(false);
        }
    }, [fetchPR, showModal]);

    const handleDelete = useCallback(async (prId) => {
        try {
            setActionLoading(true);
            const res = await deletePullRequest(prId);
            showModal(res.message, "success");
            navigate(`/repository/${repoId}/pull-requests`);
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete pull request", "error");
        } finally {
            setActionLoading(false);
        }
    }, [repoId, navigate, showModal]);

    const value = useMemo(() => ({
        pullRequests,
        branches,
        pr,
        loading,
        actionLoading,
        errorMsg,
        fetchPullRequests,
        fetchPR,
        handleUpdateStatus,
        handleDelete
    }), [pullRequests, branches, pr, loading, actionLoading, errorMsg, fetchPullRequests, fetchPR, handleUpdateStatus, handleDelete]);

    return (
        <PullRequestContext.Provider value={value}>
            {children}
        </PullRequestContext.Provider>
    );
};
