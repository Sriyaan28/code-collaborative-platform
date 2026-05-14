import { CommentModel } from '../../models/CommentModel.js'
import { createNotification } from '../../services/notificationServices/create.service.js'
import { FileModel } from '../../models/FileModel.js'
import { PRModel } from '../../models/PRModel.js'
import { IssuesModel } from '../../models/IssuesModel.js'

export const addCommentController = async (req, res) => {
    try {
        const { content, parent_type, parent_id } = req.body
        const uid = req.user?.id || req.user?._id

        if (!parent_type || !parent_id) {
            return res.status(400).json({ message: "parent_type and parent_id are required", success: false })
        }

        // if parent type is file
        if (parent_type == 'FILE') {
            const file = await FileModel.findById(parent_id)
            if (!file) {
                return res.status(404).json({ message: "Parent_id not found", success: false })
            }
        }
        // if parent type is pull request
        else if (parent_type == 'PR') {
            const pr = await PRModel.findById(parent_id)
            if (!pr) {
                return res.status(404).json({ message: "Parent_id not found", success: false })
            }
        }
        // if parent type is issue
        else if (parent_type == 'ISSUE') {
            const issue = await IssuesModel.findById(parent_id)
            if (!issue) {
                return res.status(404).json({ message: "Parent_id not found", success: false })
            }
        }
        else {
            return res.status(400).json({ message: "Enter valid parent_type", success: false })
        }

        if (!content) {
            return res.status(400).json({ message: "comment content is required", success: false })
        }
        const newComment = new CommentModel({ content, user: uid, parent_type, parent_id })
        await newComment.save()

        await createNotification({
            user: uid,
            type: 'COMMENT_ADDED',
            reference_id: parent_id,
            reference_type: parent_type
        })

        res.status(201).json({ message: "comment added successfully", payload: newComment, success: true })
    }
    catch (err) {
        console.log("error in adding comment", err)
        res.status(500).json({ message: "error in adding comment" })
    }
}