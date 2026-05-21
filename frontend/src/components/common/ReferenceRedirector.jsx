import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from './Loader';
import DashboardLayout from '../../layouts/DashboardLayout';
import useModal from '../../hooks/useModal';

// APIs
import { getFileById } from '../../api/fileApi';
import { getCommitById } from '../../api/commitApi';
import { getBranchById } from '../../api/branchApi';
import { getIssueById } from '../../api/issueApi';
import { getPullRequestById } from '../../api/prApi';
import { getCollaborator } from '../../api/collaboratorApi';

const ReferenceRedirector = ({ type }) => {
    const { referenceId } = useParams();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [error, setError] = useState(false);

    useEffect(() => {
        const resolveReference = async () => {
            if (!referenceId) return setError(true);

            try {
                let repoId = null;
                let nestedRoute = '';

                switch (type) {
                    case 'FILE': {
                        const res = await getFileById(referenceId);
                        const file = res.payload?.file || res.payload;
                        repoId = file.repository?._id || file.repository;
                        // To open a specific file, we go to files, wait, FilesPage doesn't have a URL param for file
                        // The user will just land in files tab.
                        nestedRoute = `/repository/${repoId}/files`;
                        break;
                    }
                    case 'COMMIT': {
                        const res = await getCommitById(referenceId);
                        const commitData = res.payload?.commit || res.payload;
                        repoId = commitData.repository?._id || commitData.repository;
                        nestedRoute = `/repository/${repoId}/commit/${referenceId}`;
                        break;
                    }
                    case 'BRANCH': {
                        const res = await getBranchById(referenceId);
                        const branch = res.payload?.branch || res.payload;
                        repoId = branch.repository?._id || branch.repository;
                        // Land in branches tab
                        nestedRoute = `/repository/${repoId}/branches`;
                        break;
                    }
                    case 'ISSUE': {
                        const res = await getIssueById(referenceId);
                        const issue = res.payload?.issue || res.payload;
                        repoId = issue.repository?._id || issue.repository;
                        nestedRoute = `/repository/${repoId}/issue/${referenceId}`;
                        break;
                    }
                    case 'PULL_REQUEST': {
                        const res = await getPullRequestById(referenceId);
                        const pr = res.payload;
                        repoId = pr.repository?._id || pr.repository;
                        nestedRoute = `/repository/${repoId}/pull-request/${referenceId}`;
                        break;
                    }
                    case 'COLLABORATOR': {
                        // The collab endpoint gives us the Collaborator document
                        const res = await getCollaborator(referenceId);
                        const collab = res.payload;
                        repoId = collab.repo?._id || collab.repo;
                        // Land in collaborators tab
                        nestedRoute = `/repository/${repoId}/collaborators`;
                        break;
                    }
                    default:
                        throw new Error("Unknown reference type");
                }

                if (repoId && nestedRoute) {
                    navigate(nestedRoute, { replace: true });
                } else {
                    throw new Error("Could not determine repository for this reference.");
                }

            } catch (err) {
                console.error("Failed to resolve reference", err);
                setError(true);
                showModal("Failed to open reference. It may have been deleted.", "error");
            }
        };

        resolveReference();
    }, [referenceId, type, navigate, showModal]);

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h2 className="text-2xl font-bold text-gray-300 mb-4">Reference Not Found</h2>
                    <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been deleted.</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition text-black font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Loader text={`Resolving ${type.toLowerCase()} reference...`} />
        </DashboardLayout>
    );
};

export default ReferenceRedirector;
