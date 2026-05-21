import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import RepositoryPage from "../pages/RepositoryPage";
import RepositoriesPage from "../pages/RepositoriesPage";
import SearchRepositoriesPage from "../pages/SearchRepositoriesPage";
import SearchUsersPage from "../pages/SearchUsersPage";
import ProfilePage from "../pages/ProfilePage";
import BranchesPage from "../pages/BranchesPage";
import FilesPage from "../pages/FilesPage";
import CollaboratorsPage from "../pages/CollaboratorsPage";
import NotificationPage from "../pages/NotificationPage";
import CommitsPage from "../pages/CommitsPage";
import CommitPage from "../pages/CommitPage";
import PullRequestsPage from "../pages/PullRequestsPage";
import PullRequestDetailPage from "../pages/PullRequestDetailPage";
import IssuesPage from "../pages/IssuesPage";
import IssueDetailPage from "../pages/IssueDetailPage";

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
                    path="/notification/:notificationId"
                    element={
                        <ProtectedRoute>
                            <NotificationPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repositories"
                    element={
                        <ProtectedRoute>
                            <RepositoriesPage />
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
                <Route
                    path="/repository/:repoId/branches"
                    element={
                        <ProtectedRoute>
                            <BranchesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId/files"
                    element={
                        <ProtectedRoute>
                            <FilesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId/collaborators"
                    element={
                        <ProtectedRoute>
                            <CollaboratorsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId/commits"
                    element={
                        <ProtectedRoute>
                            <CommitsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId/commit/:commitId"
                    element={
                        <ProtectedRoute>
                            <CommitPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/repository/:repoId/pull-requests"
                    element={
                        <ProtectedRoute>
                            <PullRequestsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId/pull-request/:prId"
                    element={
                        <ProtectedRoute>
                            <PullRequestDetailPage />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/repository/:repoId/issues"
                    element={
                        <ProtectedRoute>
                            <IssuesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/repository/:repoId/issue/:issueId"
                    element={
                        <ProtectedRoute>
                            <IssueDetailPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;