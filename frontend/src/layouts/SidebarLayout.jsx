import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {

    const location = useLocation();

    const sections = [

        {
            title: "MAIN",
            items: [
                {
                    name: "Dashboard",
                    path: "/dashboard"
                }
            ]
        },

        {
            title: "DISCOVER",
            items: [
                {
                    name: "Search Repositories",
                    path: "/search/repositories"
                },
                {
                    name: "Search Users",
                    path: "/search/users"
                }
            ]
        },

        {
            title: "WORKSPACE",
            items: [
                {
                    name: "Repositories",
                    path: "/repositories"
                },
                {
                    name: "Branches",
                    path: "/branches"
                },
                {
                    name: "Files",
                    path: "/files"
                },
                {
                    name: "Pull Requests",
                    path: "/pull-requests"
                }
            ]
        },

        {
            title: "COLLABORATION",
            items: [
                {
                    name: "Issues",
                    path: "/issues"
                },
                {
                    name: "Discussions",
                    path: "/discussions"
                }
            ]
        },

        {
            title: "ACCOUNT",
            items: [
                {
                    name: "Profile",
                    path: "/profile"
                }
            ]
        }

    ];

    return (

        <aside className="w-[280px] border-r border-gray-800 bg-[#0d1117] p-6 overflow-y-auto">

            <h1 className="text-3xl font-bold mb-10">
                CodeCollab
            </h1>

            <div className="space-y-8">

                {
                    sections.map((section) => (

                        <div key={section.title}>

                            <h2 className="text-xs tracking-widest text-gray-500 mb-4">
                                {section.title}
                            </h2>

                            <div className="space-y-2">

                                {
                                    section.items.map((item) => (

                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`block px-4 py-3 rounded-xl transition ${location.pathname === item.path
                                                    ? "bg-blue-500 text-black font-semibold"
                                                    : "hover:bg-[#161b22]"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))
                                }

                            </div>

                        </div>
                    ))
                }

            </div>

        </aside>
    );
};

export default Sidebar;