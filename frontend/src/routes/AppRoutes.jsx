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
import GlobalIssuesPage from "../pages/GlobalIssuesPage";
import DiscussionsPage from "../pages/DiscussionsPage";
import DiscussionDetailPage from "../pages/DiscussionDetailPage";

import ProtectedRoute from "../components/common/ProtectedRoute";
import RepositoryLayout from "../layouts/RepositoryLayout";

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
                    path="/issues"
                    element={
                        <ProtectedRoute>
                            <GlobalIssuesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/discussions"
                    element={
                        <ProtectedRoute>
                            <DiscussionsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/discussion/:id"
                    element={
                        <ProtectedRoute>
                            <DiscussionDetailPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/repository/:repoId" element={
                    <ProtectedRoute>
                        <RepositoryLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<RepositoryPage />} />
                    <Route path="branches" element={<BranchesPage />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="collaborators" element={<CollaboratorsPage />} />
                    <Route path="commits" element={<CommitsPage />} />
                    <Route path="commit/:commitId" element={<CommitPage />} />
                    <Route path="pull-requests" element={<PullRequestsPage />} />
                    <Route path="pull-request/:prId" element={<PullRequestDetailPage />} />
                    <Route path="issues" element={<IssuesPage />} />
                    <Route path="issue/:issueId" element={<IssueDetailPage />} />
                </Route>

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;