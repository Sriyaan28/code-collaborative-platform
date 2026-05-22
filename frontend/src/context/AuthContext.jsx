import { createContext, useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    // check auth on refresh
    useEffect(() => {

        const checkAuth = async () => {

            try {

                const res = await axiosInstance.get("/auth/me");

                setUser(res.data.user);

            }
            catch (err) {

                setUser(null);

            }
            finally {

                setLoading(false);

            }
        };

        checkAuth();

    }, []);

    const value = useMemo(() => ({
        user,
        setUser,
        loading
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;