import React from 'react'
import { Outlet, Link } from 'react-router-dom'

function RootLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Code Collaborative Platform
                    </h1>
                    <nav>
                        <Link to="/test-backend" className="text-blue-600 hover:text-blue-800 font-medium">
                            Test Backend
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-grow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayout