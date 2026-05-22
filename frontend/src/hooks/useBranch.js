import { useContext } from "react";
import { BranchContext } from "../context/BranchContext";

const useBranch = () => {
    const context = useContext(BranchContext);
    
    if (context === undefined) {
        throw new Error("useBranch must be used within a BranchProvider");
    }
    
    return context;
};

export default useBranch;
