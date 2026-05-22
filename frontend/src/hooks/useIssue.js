import { useContext } from "react";
import { IssueContext } from "../context/IssueContext";

const useIssue = () => {
    const context = useContext(IssueContext);
    
    if (context === undefined) {
        throw new Error("useIssue must be used within a IssueProvider");
    }
    
    return context;
};

export default useIssue;
