import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
    const navigate = useNavigate();

    return (

        <div 
            onClick={() => navigate(`/profile/${user._id}`)}
            className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 hover:border-blue-500 transition cursor-pointer"
        >

            <div className="flex items-center gap-5">

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-black">

                    {
                        user?.name?.charAt(0).toUpperCase()
                    }

                </div>

                {/* Details */}
                <div>

                    <h2 className="text-2xl font-semibold">
                        {user.name}
                    </h2>

                    <p className="text-gray-400 mt-1">
                        {user.email}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default UserCard;