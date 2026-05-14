import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

const RepositoryPage = () => {

    const { repoId } = useParams();

    return (

        <DashboardLayout>

            <div>

                <h1 className="text-4xl font-bold">
                    Repository Details
                </h1>

                <p className="text-gray-400 mt-4">
                    Repository ID:
                </p>

                <p className="mt-2 text-blue-400">
                    {repoId}
                </p>

            </div>

        </DashboardLayout>
    );
};

export default RepositoryPage;