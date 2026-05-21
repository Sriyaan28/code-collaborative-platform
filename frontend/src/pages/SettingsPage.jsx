import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { getProfile, updateProfile, deleteProfile } from "../api/userApi";
import { useAuth } from "../hooks/useAuth";
import useModal from "../hooks/useModal";

const SettingsPage = () => {
    const { setUser } = useAuth();
    const { showModal } = useModal();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const [createdAt, setCreatedAt] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                const user = data.payload || data.user;

                setFormData({
                    name: user.name || "",
                    email: user.email || ""
                });
                setCreatedAt(user.createdAt);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await updateProfile(formData);
            setUser(res.payload);
            showModal(res.message, "success");
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProfile = async () => {
        if (!deletePassword.trim()) {
            return showModal("Password required", "error");
        }
        try {
            setDeleting(true);
            const res = await deleteProfile(deletePassword);
            showModal(res.message, "success");
            window.location.href = "/login";
        } catch (err) {
            showModal(err.response?.data?.message || "Failed to delete profile", "error");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading settings..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto pb-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Settings</h1>
                    <p className="text-gray-400 mt-3">Manage your account information</p>
                </div>

                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-3 text-gray-400">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-3 text-gray-400">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none opacity-70 cursor-not-allowed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                        >
                            {saving ? "Saving..." : "Update Profile"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="ml-4 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-400 transition text-black font-semibold"
                        >
                            Delete Profile
                        </button>

                        {showDeleteModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800 w-full max-w-md">
                                    <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                                    <p className="text-gray-400 mb-4">
                                        Type your password to confirm deletion:
                                    </p>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                                    />
                                    <div className="mt-4 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className="px-6 py-3 rounded-xl border border-gray-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteProfile}
                                            disabled={deleting}
                                            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 transition text-black font-semibold"
                                        >
                                            {deleting ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
