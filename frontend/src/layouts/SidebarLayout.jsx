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

        <aside className="w-[280px] border-r border-gray-800 bg-[#0d1117] p-6 overflow-y-auto flex flex-col justify-between">

            {/* Top */}
            <div>

                {/* Logo */}
                <div className="mb-12">

                    <h1 className="text-3xl font-bold tracking-tight">
                        CodeCollab
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        Collaborative Development Platform
                    </p>

                </div>

                {/* Sections */}
                <div className="space-y-10">

                    {
                        sections.map((section) => (

                            <div key={section.title}>

                                {/* Section Title */}
                                <h2 className="text-xs tracking-[0.25em] text-gray-500 mb-4 font-semibold">

                                    {section.title}

                                </h2>

                                {/* Items */}
                                <div className="space-y-2">

                                    {
                                        section.items.map((item) => {

                                            const isActive =
                                                location.pathname === item.path;

                                            return (

                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={`block px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                                            ? "bg-blue-500 text-black font-semibold shadow-lg shadow-blue-500/20"
                                                            : "text-gray-300 hover:bg-[#161b22] hover:text-white"
                                                        }`}
                                                >

                                                    {item.name}

                                                </Link>
                                            );
                                        })
                                    }

                                </div>

                            </div>
                        ))
                    }

                </div>

            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-gray-800">

                <p className="text-sm text-gray-500 leading-6">

                    Build, collaborate, and manage repositories with your development team.

                </p>

            </div>

        </aside>
    );
};

export default Sidebar;