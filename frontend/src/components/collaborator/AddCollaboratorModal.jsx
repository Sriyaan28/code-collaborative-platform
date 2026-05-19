import { useState } from "react";

import {
    addCollaborator
} from "../../api/collaboratorApi";

import {
    searchUsers
} from "../../api/userApi";

const AddCollaboratorModal = ({
    isOpen,
    onClose,
    onCollaboratorAdded,
    repoId
}) => {

    const [loading, setLoading] = useState(false);

    const [searchLoading, setSearchLoading] = useState(false);

    const [query, setQuery] = useState("");

    const [searchType, setSearchType] = useState("name");

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);

    const [role, setRole] = useState("viewer");

    if (!isOpen) return null;

    // SEARCH USERS
    const handleSearch = async (e) => {

        e.preventDefault();

        if (!query.trim()) return;

        try {

            setSearchLoading(true);

            const data = await searchUsers(
                query,
                searchType
            );

            // SINGLE USER RESPONSE
            if (
                data.payload &&
                !Array.isArray(data.payload)
            ) {

                setUsers([data.payload]);

            }

            // ARRAY RESPONSE
            else {

                setUsers(
                    data.payload || []
                );
            }

        }
        catch (err) {

            console.log(err);

            setUsers([]);
        }
        finally {

            setSearchLoading(false);
        }
    };

    // ADD COLLABORATOR
    const handleAddCollaborator = async () => {

        if (!selectedUser) {

            return alert(
                "Please select a user"
            );
        }

        try {

            setLoading(true);

            await addCollaborator({

                repoId: repoId,

                userId: selectedUser._id,

                role
            });

            onCollaboratorAdded();

            onClose();

            // RESET
            setUsers([]);

            setSelectedUser(null);

            setQuery("");

            setRole("viewer");

        }
        catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to add collaborator"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="w-full max-w-3xl bg-[#161b22] border border-gray-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-bold">
                        Add Collaborator
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>

                </div>

                {/* SEARCH TYPE */}
                <div className="flex gap-4 mb-6">

                    <button
                        onClick={() =>
                            setSearchType("name")
                        }
                        className={`px-5 py-3 rounded-xl transition ${searchType === "name"
                            ? "bg-blue-500 text-black"
                            : "bg-[#0d1117]"
                            }`}
                    >
                        Search By Name
                    </button>

                    <button
                        onClick={() =>
                            setSearchType("email")
                        }
                        className={`px-5 py-3 rounded-xl transition ${searchType === "email"
                            ? "bg-blue-500 text-black"
                            : "bg-[#0d1117]"
                            }`}
                    >
                        Search By Email
                    </button>

                </div>

                {/* SEARCH FORM */}
                <form
                    onSubmit={handleSearch}
                    className="flex gap-4 mb-8"
                >

                    <input
                        type="text"
                        placeholder={
                            searchType === "name"
                                ? "Search by name..."
                                : "Search by email..."
                        }
                        value={query}
                        onChange={(e) =>
                            setQuery(
                                e.target.value
                            )
                        }
                        className="flex-1 p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                    />

                    <button
                        type="submit"
                        className="px-6 rounded-2xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                    >
                        Search
                    </button>

                </form>

                {/* SEARCH RESULTS */}
                {
                    searchLoading
                        ? (
                            <p className="text-gray-400 mb-8">
                                Searching users...
                            </p>
                        )
                        : users.length > 0 && (

                            <div className="space-y-4 mb-8">

                                {
                                    users.map((user) => {

                                        const isSelected =
                                            selectedUser?._id === user._id;

                                        return (

                                            <div
                                                key={user._id}
                                                onClick={() =>
                                                    setSelectedUser(user)
                                                }
                                                className={`p-5 rounded-2xl border cursor-pointer transition ${isSelected
                                                    ? "border-blue-500 bg-blue-500/10"
                                                    : "border-gray-800 bg-[#0d1117] hover:border-gray-600"
                                                    }`}
                                            >

                                                <div className="flex items-center gap-5">

                                                    <img
                                                        src={
                                                            user.userProfile
                                                        }
                                                        alt={user.name}
                                                        className="w-14 h-14 rounded-full object-cover border border-gray-700"
                                                    />

                                                    <div>

                                                        <h3 className="text-xl font-semibold text-blue-400">

                                                            {user.name}

                                                        </h3>

                                                        <p className="text-gray-400 mt-1">

                                                            {user.email}

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    })
                                }

                            </div>
                        )
                }

                {/* ROLE + SUBMIT */}
                {
                    selectedUser && (

                        <div className="space-y-5">

                            {/* Selected User */}
                            <div>

                                <p className="text-gray-400 mb-3">

                                    Selected User

                                </p>

                                <div className="bg-[#0d1117] border border-blue-500 rounded-2xl p-5 flex items-center gap-5">

                                    <img
                                        src={
                                            selectedUser.userProfile
                                        }
                                        alt={
                                            selectedUser.name
                                        }
                                        className="w-16 h-16 rounded-full object-cover border border-gray-700"
                                    />

                                    <div>

                                        <h3 className="text-2xl font-semibold text-blue-400">

                                            {selectedUser.name}

                                        </h3>

                                        <p className="text-gray-400 mt-1">

                                            {selectedUser.email}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ROLE */}
                            <div>

                                <p className="text-gray-400 mb-3">

                                    Collaborator Role

                                </p>

                                <select
                                    value={role}
                                    onChange={(e) =>
                                        setRole(
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-4 rounded-2xl bg-[#0d1117] border border-gray-700 outline-none"
                                >

                                    <option value="collaborator">
                                        Collaborator
                                    </option>

                                    <option value="viewer">
                                        Viewer
                                    </option>

                                    <option value="blocked">
                                        Blocked
                                    </option>

                                </select>

                            </div>

                            {/* SUBMIT */}
                            <button
                                onClick={
                                    handleAddCollaborator
                                }
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl transition font-semibold ${role === "blocked"
                                    ? "bg-red-500 hover:bg-red-400 text-black"
                                    : "bg-blue-500 hover:bg-blue-400 text-black"
                                    }`}
                            >
                                {
                                    loading
                                        ? "Adding..."
                                        : role === "blocked"
                                            ? "Block User"
                                            : "Add Collaborator"
                                }
                            </button>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default AddCollaboratorModal;