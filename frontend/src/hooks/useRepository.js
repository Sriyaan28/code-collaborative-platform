import { useContext } from "react";
import { RepositoryContext } from "../context/RepositoryContext";

const useRepository = () => {
    const context = useContext(RepositoryContext);
    
    if (context === undefined) {
        throw new Error("useRepository must be used within a RepositoryProvider");
    }
    
    return context;
};

export default useRepository;
