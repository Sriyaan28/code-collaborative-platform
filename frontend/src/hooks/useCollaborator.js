import { useContext } from "react";
import { CollaboratorContext } from "../context/CollaboratorContext";

const useCollaborator = () => {
    const context = useContext(CollaboratorContext);
    
    if (context === undefined) {
        throw new Error("useCollaborator must be used within a CollaboratorProvider");
    }
    
    return context;
};

export default useCollaborator;
