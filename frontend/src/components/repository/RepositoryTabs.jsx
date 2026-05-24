import { Link, useLocation } from "react-router-dom";

const RepositoryTabs = ({
    repoId,
    repository
}) => {

    const location = useLocation();

    const tabs = [

        {
            name: "Overview",
            path: `/repository/${repoId}`
        },

        {
            name: "Branches",
            path: `/repository/${repoId}/branches`
        },

        {
            name: "Files",
            path: `/repository/${repoId}/files`
        },

        ...(repository?.currentUserRole !== 'viewer' ? [{
            name: "Pull Requests",
            path: `/repository/${repoId}/pull-requests`
        }] : []),

        ...(repository?.currentUserRole !== 'viewer' ? [{
            name: "Issues",
            path: `/repository/${repoId}/issues`
        }] : []),

        ...(repository?.currentUserRole === 'owner' ? [{
            name: "Collaborators",
            path: `/repository/${repoId}/collaborators`
        }] : []),

        {
            name: "Commits",
            path: `/repository/${repoId}/commits`
        },

        ...(repository?.currentUserRole === 'owner' ? [{
            name: "Settings",
            path: `/repository/${repoId}/settings`
        }] : [])

    ];

    return (

        <div className="flex flex-wrap gap-4 border-b border-gray-800 pb-6 mb-10">

            {
                tabs.map((tab) => {

                    const isActive =
                        location.pathname === tab.path;

                    return (

                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`px-5 py-3 rounded-2xl transition ${isActive
                                ? "bg-blue-500 text-black font-semibold"
                                : "bg-[#161b22] hover:bg-[#1f2937]"
                                }`}
                        >
                            {tab.name}
                        </Link>
                    );
                })
            }

        </div>
    );
};

export default RepositoryTabs;