import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../api/axios";

const RegisterPage = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

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

            await axiosInstance.post(
                "/auth/register",
                formData
            );

            alert("Registration Success");

            navigate("/login");

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Registration Failed"
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
                    Register
                </h1>

                <div className="space-y-5">

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl bg-[#0d1117] border border-gray-700 outline-none"
                        required
                    />

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
                                ? "Creating Account..."
                                : "Register"
                        }
                    </button>
                </div>

                <p className="mt-6 text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-400"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;