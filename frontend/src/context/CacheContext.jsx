import { createContext, useRef, useContext } from 'react';

const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
    const cache = useRef(new Map());

    const getCache = (key) => cache.current.get(key);
    const setCache = (key, data) => cache.current.set(key, data);
    const clearCache = () => cache.current.clear();

    return (
        <CacheContext.Provider value={{ getCache, setCache, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useAppCache = () => {
    const context = useContext(CacheContext);
    if (!context) throw new Error("useAppCache must be used within CacheProvider");
    return context;
};
