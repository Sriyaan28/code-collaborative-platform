import { Link } from "react-router-dom";
// import { Github, GitPullRequest, Bug, Users } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0d1117] text-white">

            {/* Navbar */}
            <nav className="h-[72px] border-b border-gray-800 px-10 flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-black">
                        C
                    </div>

                    <h1 className="text-2xl font-bold">
                        CodeCollab
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <button className="px-5 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition">
                            Login
                        </button>
                    </Link>

                    <Link to="/register">
                        <button className="px-5 py-2 rounded-lg bg-blue-500 text-black font-semibold hover:bg-blue-400 transition">
                            Get Started
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-10 py-28 flex flex-col lg:flex-row items-center justify-between gap-20">

                {/* Left */}
                <div className="flex-1">

                    <div className="inline-block px-4 py-2 rounded-full border border-gray-700 bg-gray-900 text-blue-400 text-sm mb-6">
                        Collaborative Development Platform
                    </div>

                    <h1 className="text-6xl font-bold leading-tight mb-8">
                        Build Software
                        <br />
                        Together
                    </h1>

                    <p className="text-gray-400 text-lg leading-8 max-w-2xl mb-10">
                        Manage repositories, collaborate with teams,
                        create pull requests, track issues, and build
                        projects together using a modern GitHub-inspired
                        development platform.
                    </p>

                    <div className="flex gap-5 flex-wrap">
                        <Link to="/register">
                            <button className="px-7 py-3 rounded-xl bg-blue-500 text-black font-semibold hover:bg-blue-400 transition">
                                Start Building
                            </button>
                        </Link>

                        <Link to="/login">
                            <button className="px-7 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition">
                                Explore Platform
                            </button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-12 mt-16 flex-wrap">

                        <div>
                            <h2 className="text-3xl font-bold text-blue-400">
                                Repositories
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Version controlled projects
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-blue-400">
                                Pull Requests
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Team code reviews
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-blue-400">
                                Issues
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Track project tasks
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex-1 w-full">

                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

                        <div className="h-14 border-b border-gray-800 bg-[#0d1117] flex items-center px-6 gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>

                        <div className="p-6 space-y-5">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-blue-400 font-semibold">
                                            collaborative-platform
                                        </h3>

                                        <span className="text-xs text-gray-500">
                                            Public
                                        </span>
                                    </div>

                                    <p className="text-gray-400 leading-7">
                                        Full-stack collaborative repository
                                        management platform.
                                    </p>

                                    <div className="flex gap-5 mt-5 text-sm text-gray-500">
                                        <span>⭐ 128</span>
                                        <span>🔀 54</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-10 pb-24">

                <h2 className="text-5xl font-bold text-center mb-20">
                    Platform Features
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {[
                        {
                            icon: "📁",
                            title: "Repositories",
                            desc: "Manage repositories with version control and branching.",
                        },
                        {

                            icon: "🔀",
                            title: "Pull Requests",
                            desc: "Review and merge code collaboratively.",
                        },
                        {

                            icon: "🐛",
                            title: "Issues",
                            desc: "Track bugs and manage development tasks.",
                        },
                        {

                            icon: "👥",
                            title: "Collaboration",
                            desc: "Work together with your development team.",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 hover:border-blue-500 transition"
                        >
                            <div className="text-blue-400 mb-6">
                                {feature.icon}
                            </div>

                            <h3 className="text-2xl font-semibold mb-4">
                                {feature.title}
                            </h3>

                            <p className="text-gray-400 leading-7">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
                © 2026 CodeCollab Platform
            </footer>
        </div>
    );
};

export default LandingPage;