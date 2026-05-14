import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import RepositoryPage from "../pages/RepositoryPage";
import SearchRepositoriesPage from "../pages/SearchRepositoriesPage";
import SearchUsersPage from "../pages/SearchUsersPage";
import ProfilePage from "../pages/ProfilePage";

import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId"
                    element={
                        <ProtectedRoute>
                            <RepositoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search/repositories"
                    element={
                        <ProtectedRoute>
                            <SearchRepositoriesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search/users"
                    element={
                        <ProtectedRoute>
                            <SearchUsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;