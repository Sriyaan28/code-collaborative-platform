import { useContext } from "react";
import { CommitContext } from "../context/CommitContext";

const useCommit = () => {
    const context = useContext(CommitContext);
    
    if (context === undefined) {
        throw new Error("useCommit must be used within a CommitProvider");
    }
    
    return context;
};

export default useCommit;
