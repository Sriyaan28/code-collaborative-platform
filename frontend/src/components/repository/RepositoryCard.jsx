import { useNavigate } from "react-router-dom";

const RepositoryCard = ({ repository }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {

        navigate(`/repository/${repository._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-[#161b22] border border-gray-800 rounded-3xl p-6 hover:border-blue-500 transition cursor-pointer">

            <div className="flex items-center justify-between">

                <h2 className="text-2xl font-semibold text-blue-400">
                    {repository.name}
                </h2>

                <span className="text-sm text-gray-500">
                    {repository.visibility}
                </span>

            </div>

            <div className="relative mt-5 h-14 overflow-hidden group-hover:h-auto group-hover:overflow-visible transition-all">
                <p className="text-gray-400 leading-7">
                    {
                        repository.description ||
                        "No description"
                    }
                </p>
                {repository.description && repository.description.length > 70 && (
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#161b22] to-transparent pointer-events-none group-hover:opacity-0 transition-opacity"></div>
                )}
            </div>

        </div>
    );
};

export default RepositoryCard;