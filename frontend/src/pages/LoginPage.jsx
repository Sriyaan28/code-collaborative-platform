import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import axiosInstance from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import useModal from "../hooks/useModal";

const LoginPage = () => {

    const navigate = useNavigate();

    const { user, setUser } = useAuth();
    const { showModal } = useModal();


    useEffect(() => {

        if (user) {
            navigate("/dashboard");
            return;
        }

    }, [user]);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await axiosInstance.post(
                "/auth/login",
                formData
            );

            setUser(res.data.payload || res.data.user);

            navigate("/dashboard");

        }
        catch (err) {

            showModal(
                err.response?.data?.message ||
                "Login failed",
                "error"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white px-5">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-3xl p-8"
            >

                <h1 className="text-3xl font-bold mb-8">
                    Login
                </h1>

                <div className="space-y-5">

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-400 transition text-black font-semibold py-4 rounded-xl"
                    >
                        {
                            loading
                                ? "Logging in..."
                                : "Login"
                        }
                    </button>
                </div>

                <p className="mt-6 text-gray-400">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-400"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;