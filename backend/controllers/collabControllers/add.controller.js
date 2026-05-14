import { CollaboratorModel } from "../../models/CollaboratorModel.js"
import { RepositoryModel } from "../../models/RepositoryModel.js"
import { createNotification } from "../../services/notificationServices/create.service.js"

export const addCollabController = async (req, res) => {
    try {
        const { repoId, role, userId } = req.body

        // get logged in user id from token
        const loggedIn = req.user?._id || req.user?.id

        // find repository
        const repo = await RepositoryModel.findById(repoId)
        if (!repo) {
            return res.status(404).json({ message: "Repository not found" })
        }
        // Only owner can add collaborators
        if (repo.owner.toString() !== loggedIn.toString()) {
            return res.status(403).json({ message: "Only owner can add collaborators" })
        }
        const existingCollab = await CollaboratorModel.findOne({ repo: repoId, user: userId })
        if (existingCollab) {
            return res.status(400).json({ message: "User is already has a role in the repo" })
        }
        const newCollaborator = new CollaboratorModel({
            repo: repoId,
            role: role || "viewer",
            user: userId
        })
        const result = await newCollaborator.save()
        console.log("Collaborator added successfully", result)

        // send notification to collaborator
        await createNotification({
            user: userId,
            type: "COLLAB_ADDED",
            reference_id: repoId,
            reference_type: "REPOSITORY"
        })
        // send collaborator details as a notification to owner 
        await createNotification({
            user: loggedIn,
            type: "COLLAB_ADDED",
            reference_id: result._id,
            reference_type: "COLLABORATOR"
        })

        res.status(201).json({ message: "Collaborator added", payload: result })
    } catch (err) {
        console.log("error in adding collaborator", err)
        res.status(500).json({ message: "error in adding collaborator" })
    }
}