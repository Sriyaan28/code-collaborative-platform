import { useContext } from "react";
import { DiscussionContext } from "../context/DiscussionContext";

const useDiscussion = () => {
    const context = useContext(DiscussionContext);
    
    if (context === undefined) {
        throw new Error("useDiscussion must be used within a DiscussionProvider");
    }
    
    return context;
};

export default useDiscussion;
