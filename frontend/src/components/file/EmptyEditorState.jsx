const EmptyEditorState = () => {

    return (

        <div className="flex-1 flex items-center justify-center">

            <div className="text-center">

                <h2 className="text-4xl font-bold mb-5">

                    No File Selected

                </h2>

                <p className="text-gray-500 text-lg leading-8">

                    Select a file from the explorer
                    <br />
                    or create a new file.

                </p>

            </div>

        </div>
    );
};

export default EmptyEditorState;