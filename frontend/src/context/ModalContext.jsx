import { createContext, useState, useEffect } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        type: "success" // "success" or "error"
    });

    useEffect(() => {
        let timer;
        if (modal.isOpen) {
            timer = setTimeout(() => {
                setModal((prev) => ({ ...prev, isOpen: false }));
            }, 6000); // Auto-dismiss after 6s
        }
        return () => clearTimeout(timer);
    }, [modal.isOpen]);

    const showModal = (message, type = "success") => {
        // Simple heuristic for generic alert messages to determine type
        if (message && message.toLowerCase().includes("failed") && type === "success") {
            type = "error";
        }
        setModal({ isOpen: true, message, type });
    };

    const closeModal = () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ showModal }}>
            {children}
            
            {modal.isOpen && (
                <div 
                    className={`fixed bottom-6 right-6 z-[9999] min-w-[300px] max-w-sm rounded-2xl p-5 shadow-2xl shadow-black/50 border transition-all duration-500 flex items-start gap-4 ${
                        modal.type === "error" 
                            ? "bg-[#251010] border-red-900/50 text-red-100" 
                            : "bg-[#102516] border-green-900/50 text-green-100"
                    }`}
                    style={{ animation: "slideInUp 0.3s ease-out forwards" }}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                                {modal.type === "error" ? "⚠️" : "✅"}
                            </span>
                            <h3 className={`font-bold ${modal.type === "error" ? "text-red-400" : "text-green-400"}`}>
                                {modal.type === "error" ? "Error" : "Success"}
                            </h3>
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed mt-1 break-words">
                            {modal.message}
                        </p>
                    </div>
                    
                    <button 
                        onClick={closeModal}
                        className={`text-xl leading-none opacity-60 hover:opacity-100 transition ${
                            modal.type === "error" ? "hover:text-red-400" : "hover:text-green-400"
                        }`}
                    >
                        ✕
                    </button>
                </div>
            )}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}} />
        </ModalContext.Provider>
    );
};
