import { createContext, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";
import { getAllDiscussions, getDiscussionById, toggleLikeDiscussion, addComment, deleteDiscussion, deleteComment } from "../api/discussionApi";

export const DiscussionContext = createContext();

export const DiscussionProvider = ({ children }) => {
    const { showModal } = useModal();
    const navigate = useNavigate();

    const [discussions, setDiscussions] = useState([]);
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const initialFetchDone = useRef(false);
    const currentSearchRef = useRef("");

    const initialDiscussionFetchDone = useRef(false);
    const currentDiscussionRef = useRef(null);

    const fetchDiscussions = useCallback(async (search = "") => {
        if (currentSearchRef.current !== search) {
            setDiscussions([]);
            initialFetchDone.current = false;
            currentSearchRef.current = search;
        }

        try {
            if (!initialFetchDone.current) setLoading(true);
            const res = await getAllDiscussions(search);
            setDiscussions(res.payload || []);
            initialFetchDone.current = true;
        } catch (err) {
            showModal("Failed to fetch discussions", "error");
        } finally {
            setLoading(false);
        }
    }, [showModal]);

    const fetchDiscussion = useCallback(async (id) => {
        if (!id) return;

        if (currentDiscussionRef.current !== id) {
            setDiscussion(null);
            initialDiscussionFetchDone.current = false;
            currentDiscussionRef.current = id;
        }

        try {
            if (!initialDiscussionFetchDone.current) setLoading(true);
            const res = await getDiscussionById(id);
            setDiscussion(res.payload);
            initialDiscussionFetchDone.current = true;
        } catch (err) {
            showModal("Failed to fetch discussion details", "error");
        } finally {
            setLoading(false);
        }
    }, [showModal]);

    const handleLike = useCallback(async (id) => {
        try {
            const res = await toggleLikeDiscussion(id);
            setDiscussion(prev => prev ? { ...prev, likes: res.payload } : prev);
        } catch (err) {
            showModal("Failed to like discussion", "error");
        }
    }, [showModal]);

    const handleAddComment = useCallback(async (id, commentInput) => {
        try {
            setActionLoading(true);
            const res = await addComment(id, commentInput);
            setDiscussion(prev => prev ? { ...prev, comments: res.payload } : prev);
            return true;
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to add comment", "error");
            return false;
        } finally {
            setActionLoading(false);
        }
    }, [showModal]);

    const handleDelete = useCallback(async (id) => {
        try {
            setActionLoading(true);
            await deleteDiscussion(id);
            showModal("Discussion deleted successfully", "success");
            navigate("/discussions");
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete discussion", "error");
        } finally {
            setActionLoading(false);
        }
    }, [navigate, showModal]);

    const handleDeleteComment = useCallback(async (discussionId, commentId) => {
        try {
            setActionLoading(true);
            const res = await deleteComment(discussionId, commentId);
            setDiscussion(prev => prev ? { ...prev, comments: res.payload } : prev);
            showModal("Comment deleted successfully", "success");
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete comment", "error");
        } finally {
            setActionLoading(false);
        }
    }, [showModal]);

    const value = useMemo(() => ({
        discussions,
        discussion,
        loading,
        actionLoading,
        fetchDiscussions,
        fetchDiscussion,
        handleLike,
        handleAddComment,
        handleDelete,
        handleDeleteComment
    }), [discussions, discussion, loading, actionLoading, fetchDiscussions, fetchDiscussion, handleLike, handleAddComment, handleDelete, handleDeleteComment]);

    return (
        <DiscussionContext.Provider value={value}>
            {children}
        </DiscussionContext.Provider>
    );
};
