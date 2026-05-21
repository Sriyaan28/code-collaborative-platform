import { NotificationModel } from "../../models/NotificationModel.js";

export const createNotification = async ({
    user,
    type,
    reference_id,
    reference_type
}) => {

    const validTypes = [
        'USER_LOGIN',
        'PROFILE_UPDATED',
        'REPOSITORY_CREATED',
        'REPOSITORY_UPDATED',
        'REPOSITORY_DELETED',
        'FILE_CREATED',
        'FILE_UPDATED',
        'FILE_DELETED',
        'FILE_RESTORED',
        'PR_CREATED',
        'PR_MERGED',
        'PR_CLOSED',
        'PR_DELETED',
        'BRANCH_CREATED',
        'BRANCH_DELETED',
        'COMMIT_CREATED',
        'COMMIT_ROLLBACK',
        'COLLAB_ADDED',
        'COLLAB_REMOVED',
        'COMMENT_ADDED',
        'ISSUE_ASSIGNED'
    ];

    if (!validTypes.includes(type)) {
        throw new Error("Invalid notification type");
    }

    const validReferenceTypes = [
        'USER',
        'REPOSITORY',
        'FILE',
        'PR',
        'BRANCH',
        'COMMIT',
        'COLLABORATOR',
        'COMMENT',
        'ISSUE'
    ];

    if (!validReferenceTypes.includes(reference_type)) {
        throw new Error("Invalid reference type");
    }

    const notification = new NotificationModel({
        user,
        type,
        reference_id,
        reference_type,
        message: generateMessage(type)
    });

    return await notification.save();
};

function generateMessage(type) {
    switch (type) {
        case 'ISSUE_ASSIGNED':
            return 'Issue assigned';

        case 'USER_LOGIN':
            return 'User logged in';

        case 'REPOSITORY_CREATED':
            return 'Repository created';

        case 'REPOSITORY_UPDATED':
            return 'Repository updated';

        case 'REPOSITORY_DELETED':
            return 'Repository deleted';

        case 'FILE_CREATED':
            return 'File created';

        case 'FILE_UPDATED':
            return 'File updated';

        case 'FILE_DELETED':
            return 'File deleted';

        case 'PR_CREATED':
            return 'PR created';

        case 'PR_MERGED':
            return 'PR merged';

        case 'PR_CLOSED':
            return 'PR closed';

        case 'PR_DELETED':
            return 'PR deleted';

        case 'BRANCH_CREATED':
            return 'Branch created';

        case 'BRANCH_DELETED':
            return 'Branch deleted';

        case 'COMMIT_CREATED':
            return 'Commit created';

        case 'COMMIT_ROLLBACK':
            return 'Rollback successful';

        case 'COLLAB_ADDED':
            return 'Collaborator added';

        case 'COLLAB_REMOVED':
            return 'Collaborator removed';

        case 'COLLAB_UPDATED':
            return 'Collaborator updated';

        case 'COMMENT_ADDED':
            return 'Comment added';

        default:
            return 'New notification';
    }
}