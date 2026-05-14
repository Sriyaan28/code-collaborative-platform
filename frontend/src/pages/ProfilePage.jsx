import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import Loader from "../components/common/Loader";

import {
    getProfile,
    updateProfile,
    deleteProfile
} from "../api/userApi";

// update and delete aren't working properly
// update and delete
// is calling the api and getting 500 server error

import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {

    const { setUser } = useAuth();

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

                const user = data.payload;

                setFormData({
                    name: user.name || "",
                    email: user.email || ""
                });

                setCreatedAt(user.createdAt);

            }
            catch (err) {

                console.log(err);
            }
            finally {

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

            const data = await updateProfile(
                formData
            );

            setUser(data.payload);

            alert("Profile Updated");

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to update profile"
            );
        }
        finally {

            setSaving(false);
        }
    };
    const handleDeleteProfile = async () => {

        if (!deletePassword.trim()) {
            return alert("Password required");
        }

        try {

            setDeleting(true);

            await deleteProfile(deletePassword);

            alert("Profile Deleted");

            window.location.href = "/login";

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete profile"
            );
        }
        finally {

            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader text="Loading profile..." />
            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-10">

                    <h1 className="text-4xl font-bold">
                        Profile
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Manage your account information
                    </p>

                </div>

                {/* Profile Card */}
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8">

                    {/* Avatar */}
                    <div className="flex items-center gap-6 mb-10">

                        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold text-black">

                            {
                                formData.name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                            }

                        </div>

                        <div>

                            <h2 className="text-3xl font-bold">
                                {formData.name}
                            </h2>

                            <p className="text-gray-400 mt-2">
                                {formData.email}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Joined {
                                    createdAt
                                        ? new Date(createdAt)
                                            .toLocaleDateString()
                                        : "N/A"
                                }
                            </p>

                        </div>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div>

                            <label className="block mb-3 text-gray-400">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                            />

                        </div>

                        <div>

                            <label className="block mb-3 text-gray-400">
                                Email
                            </label>

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
                            {
                                saving
                                    ? "Saving..."
                                    : "Update Profile"
                            }
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowDeleteModal(true)
                            }
                            className="ml-4 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-400 transition text-black font-semibold"
                        >
                            Delete Profile
                        </button>
                        {showDeleteModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-[#161b22] p-6 rounded-2xl border border-gray-800">
                                    <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                                    <p className="text-gray-400 mb-4">
                                        Type your password to confirm deletion:
                                    </p>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) =>
                                            setDeletePassword(e.target.value)
                                        }
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

export default ProfilePage;