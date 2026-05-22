import { createContext, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getAllIssues, getIssueById, updateIssueStatus, deleteIssue } from "../api/issueApi";

export const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
    const { repoId } = useParams();
    const { showModal } = useModal();
    const navigate = useNavigate();

    const [issues, setIssues] = useState([]);
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const initialFetchDone = useRef(false);
    const currentRepoRef = useRef(repoId);

    const initialIssueFetchDone = useRef(false);
    const currentIssueRef = useRef(null);

    const fetchIssues = useCallback(async () => {
        if (!repoId) return;

        if (currentRepoRef.current !== repoId) {
            setIssues([]);
            initialFetchDone.current = false;
            currentRepoRef.current = repoId;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const res = await getAllIssues(repoId);
            setIssues(res.payload?.issues || []);
            initialFetchDone.current = true;
        } catch (err) {
            showModal("Failed to fetch issues", "error");
        } finally {
            setLoading(false);
        }
    }, [repoId, showModal]);

    const fetchIssue = useCallback(async (issueId) => {
        if (!issueId) return;

        if (currentIssueRef.current !== issueId) {
            setIssue(null);
            initialIssueFetchDone.current = false;
            currentIssueRef.current = issueId;
        }

        try {
            if (!initialIssueFetchDone.current) setLoading(true);
            setErrorMsg(null);
            const res = await getIssueById(issueId);
            setIssue(res.payload?.issue || res.payload);
            initialIssueFetchDone.current = true;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch issue details";
            setErrorMsg(msg);
            showModal(msg, "error");
        } finally {
            setLoading(false);
        }
    }, [showModal]);

    const handleUpdateStatus = useCallback(async (issueId, status) => {
        try {
            setActionLoading(true);
            const res = await updateIssueStatus(issueId, status);
            showModal(res.message, "success");
            fetchIssue(issueId);
        } catch (err) {
            showModal(err.response?.data?.message || `Failed to ${status} issue`, "error");
        } finally {
            setActionLoading(false);
        }
    }, [fetchIssue, showModal]);

    const handleDelete = useCallback(async (issueId) => {
        try {
            setActionLoading(true);
            const res = await deleteIssue(issueId);
            showModal(res.message, "success");
            navigate(`/repository/${repoId}/issues`);
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete issue", "error");
        } finally {
            setActionLoading(false);
        }
    }, [repoId, navigate, showModal]);

    const value = useMemo(() => ({
        issues,
        issue,
        loading,
        actionLoading,
        errorMsg,
        fetchIssues,
        fetchIssue,
        handleUpdateStatus,
        handleDelete
    }), [issues, issue, loading, actionLoading, errorMsg, fetchIssues, fetchIssue, handleUpdateStatus, handleDelete]);

    return (
        <IssueContext.Provider value={value}>
            {children}
        </IssueContext.Provider>
    );
};
