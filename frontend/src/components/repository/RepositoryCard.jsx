import { useNavigate } from "react-router-dom";

const RepositoryCard = ({ repository }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {

        navigate(`/repository/${repository._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 hover:border-blue-500 transition cursor-pointer">

            <div className="flex items-center justify-between">

                <h2 className="text-2xl font-semibold text-blue-400">
                    {repository.name}
                </h2>

                <span className="text-sm text-gray-500">
                    {repository.visibility}
                </span>

            </div>

            <p className="text-gray-400 mt-5 leading-7">
                {
                    repository.description ||
                    "No description"
                }
            </p>

        </div>
    );
};

export default RepositoryCard;