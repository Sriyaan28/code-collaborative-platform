import { useContext } from "react";
import { PullRequestContext } from "../context/PullRequestContext";

const usePullRequest = () => {
    const context = useContext(PullRequestContext);
    
    if (context === undefined) {
        throw new Error("usePullRequest must be used within a PullRequestProvider");
    }
    
    return context;
};

export default usePullRequest;
