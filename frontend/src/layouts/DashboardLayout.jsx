import Sidebar from "./SidebarLayout"

import TopNavbar from "./TopNavbar"

const DashboardLayout = ({ children }) => {

    return (

        <div className="h-screen bg-[#0d1117] text-white flex overflow-hidden">

            {/* Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div className="flex-1 flex flex-col">

                {/* Top Navbar */}
                <TopNavbar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">

                    {children}

                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;