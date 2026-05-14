const Loader = ({
    text = "Loading..."
}) => {

    return (

        <div className="w-full flex flex-col items-center justify-center py-20">

            {/* Spinner */}
            <div className="relative w-14 h-14">

                <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>

                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

            </div>

            {/* Text */}
            <p className="mt-6 text-gray-400 text-lg">
                {text}
            </p>

        </div>
    );
};

export default Loader;