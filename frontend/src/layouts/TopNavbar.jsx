import { useAuth } from "../hooks/useAuth";
import LogoutButton from "../components/common/LogoutButton";

const TopNavbar = () => {

    const { user } = useAuth();

    return (

        <div className="h-[72px] border-b border-gray-800 px-8 flex items-center justify-between bg-[#0d1117]">

            {/* Left */}
            <div>

                <h1 className="text-xl font-semibold">
                    Collaborative Development Platform
                </h1>

            </div>

            {/* Right */}
            <div className="flex items-center gap-5">

                {/* Notifications */}
                <button className="relative w-11 h-11 rounded-full bg-[#161b22] hover:bg-[#1f2937] transition flex items-center justify-center text-xl">

                    🔔

                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 bg-[#161b22] px-4 py-2 rounded-xl">

                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-black font-bold">

                        {
                            user?.name?.charAt(0).toUpperCase()
                        }

                    </div>

                    <div>

                        <p className="font-medium">
                            {user?.name}
                        </p>

                        <p className="text-sm text-gray-400">
                            {user?.email}
                        </p>

                    </div>

                </div>

                {/* Logout */}
                <LogoutButton />

            </div>

        </div>
    );
};

export default TopNavbar;