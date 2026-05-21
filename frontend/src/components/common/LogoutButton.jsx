import { useNavigate } from "react-router-dom";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";

const LogoutButton = () => {

    const navigate = useNavigate();

    const { setUser } = useAuth();
    const { showModal } = useModal();

    const handleLogout = async () => {

        try {

            await axiosInstance.get("/auth/logout");

            setUser(null);

            navigate("/login");

        }
        catch (err) {

            showModal(
                err.response?.data?.message ||
                "Logout Failed",
                "error"
            );
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-black font-semibold transition"
        >
            Logout
        </button>
    );
};

export default LogoutButton;