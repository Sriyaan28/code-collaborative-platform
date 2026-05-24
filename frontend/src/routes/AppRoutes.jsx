import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import RepositoryPage from "../pages/RepositoryPage";
import RepositorySettingsPage from "../pages/RepositorySettingsPage";
import RepositoriesPage from "../pages/RepositoriesPage";
import SearchRepositoriesPage from "../pages/SearchRepositoriesPage";
import SearchUsersPage from "../pages/SearchUsersPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
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
import ReferenceRedirector from "../components/common/ReferenceRedirector";
import RepositoryLayout from "../layouts/RepositoryLayout";
import { RepositoryProvider } from "../context/RepositoryContext";
import { FileProvider } from "../context/FileContext";
import { CommitProvider } from "../context/CommitContext";
import { BranchProvider } from "../context/BranchContext";
import { CollaboratorProvider } from "../context/CollaboratorContext";
import { DiscussionProvider } from "../context/DiscussionContext";
import { IssueProvider } from "../context/IssueContext";
import { PullRequestProvider } from "../context/PullRequestContext";
import { NotificationProvider } from "../context/NotificationContext";
import { CacheProvider } from "../context/CacheContext";

const AppRoutes = () => {

    return (

        <BrowserRouter>
            <CacheProvider>
                <NotificationProvider>
                    <DiscussionProvider>
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
                    path="/profile/:userId"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
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
                <Route path="/discussions" element={
                    <ProtectedRoute>
                        <DiscussionsPage />
                    </ProtectedRoute>
                } />
                <Route path="/discussion/:id" element={
                    <ProtectedRoute>
                        <DiscussionDetailPage />
                    </ProtectedRoute>
                } />

                {/* Reference Redirectors */}
                <Route path="/file/:referenceId" element={<ProtectedRoute><ReferenceRedirector type="FILE" /></ProtectedRoute>} />
                <Route path="/commit/:referenceId" element={<ProtectedRoute><ReferenceRedirector type="COMMIT" /></ProtectedRoute>} />
                <Route path="/branch/:referenceId" element={<ProtectedRoute><ReferenceRedirector type="BRANCH" /></ProtectedRoute>} />
                <Route path="/issue/:referenceId" element={<ProtectedRoute><ReferenceRedirector type="ISSUE" /></ProtectedRoute>} />
                <Route path="/pull-request/:referenceId" element={<ProtectedRoute><ReferenceRedirector type="PULL_REQUEST" /></ProtectedRoute>} />
                <Route path="/collaborator/:referenceId" element={<ProtectedRoute><ReferenceRedirector type="COLLABORATOR" /></ProtectedRoute>} />

                <Route path="/repository/:repoId" element={
                    <ProtectedRoute>
                        <RepositoryProvider>
                            <BranchProvider>
                                <FileProvider>
                                    <CollaboratorProvider>
                                        <CommitProvider>
                                            <PullRequestProvider>
                                                <IssueProvider>
                                                    <RepositoryLayout />
                                                </IssueProvider>
                                            </PullRequestProvider>
                                        </CommitProvider>
                                    </CollaboratorProvider>
                                </FileProvider>
                            </BranchProvider>
                        </RepositoryProvider>
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
                    <Route path="settings" element={<RepositorySettingsPage />} />
                </Route>

                        </Routes>
                    </DiscussionProvider>
                </NotificationProvider>
            </CacheProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;