import { IssuesModel } from '../../models/IssuesModel.js'
import { UserModel } from '../../models/UserModel.js'
import { createNotification } from '../../services/notificationServices/create.service.js'

// create an issue
export const createIssueController = async (req, res) => {
    try {
        // get uid
        const uid = req.user.uid
        const { repository, title, description, assignees } = req.body



        // check if role is owner or collaborator
        const role = req.role
        if (role !== "owner" && role !== "collaborator") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to create an issue"
            })
        }

        // check if assignees are present in UserModel(use for each)
        assignees.forEach(async (assignee) => {
            const user = await UserModel.findOne({ uid: assignee })
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: `Assignee ${assignee} is not a valid user`
                })
            }
        })

        // create issue
        const issue = new IssuesModel({
            repository,
            title,
            description,
            assignees,
            createdBy: uid
        })

        // save issue
        await issue.save()

        // send notification to all assignees
        assignees.forEach(async (assignee) => {
            await createNotification({
                user: assignee,
                type: "ISSUE_ASSIGNED",
                reference_id: issue._id,
                reference_type: "ISSUE"
            })
        })

        // send response
        return res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: issue
        })

    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}
