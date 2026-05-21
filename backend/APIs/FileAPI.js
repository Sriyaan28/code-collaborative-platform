import exp from 'express';
import { createFileController } from '../controllers/fileControllers/create.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRepoAccess } from '../middleware/checkRepoAccess.js'
import { editFileController } from '../controllers/fileControllers/edit.controller.js';
import { deleteFileController, deleteFileToggleController } from '../controllers/fileControllers/delete.controller.js';
import { getAllBranchFilesController, getAllFilesController, getAllMainBranchFilesController } from '../controllers/fileControllers/getAll.controller.js';
import { getFileController } from '../controllers/fileControllers/get.controller.js';
import { analyzeCodeHealth } from '../services/aiServices/codeHealthService.js';
import { generateCodeService } from '../services/aiServices/codeGenerationService.js';

export const fileApp = exp.Router()

// route for creating a file
fileApp.post('/file', verifyToken, checkRepoAccess, createFileController)

// route for updating a file
fileApp.put('/file', verifyToken, checkRepoAccess, editFileController)

// route for temporarily deleting a file
fileApp.put('/file/toggle-delete/:fileId', verifyToken, checkRepoAccess, deleteFileToggleController)

// route for permanentely deleting a file
fileApp.delete('/file/:fileId', verifyToken, deleteFileController)

// route for retrieving a file
fileApp.get('/file/:fileId', verifyToken, getFileController)

// route for retrieving all files using repoId
fileApp.get('/repo/:repoId', verifyToken, checkRepoAccess, getAllFilesController)

// route for getting all files of a main branch using repoId
fileApp.get('/repo/:repoId/branch/main', verifyToken, checkRepoAccess, getAllMainBranchFilesController)

// route for getting all files of a branch using repoId and branchId
fileApp.get('/repo/:repoId/branch/:branchId', verifyToken, checkRepoAccess, getAllBranchFilesController)

// route for code health analyzer
fileApp.post('/code-health', verifyToken, async (req, res) => {

    try {

        const { code } = req.body

        if (!code) {

            return res.status(400).json({
                message: "Code is required"
            })
        }

        const result = await analyzeCodeHealth(code)

        return res.status(200).json({
            message: "Code health analyzed successfully",
            payload: result
        })
    }
    catch (err) {

        console.log(err)

        return res.status(500).json({
            message: "Error analyzing code health",
            error: err.message
        })
    }
})

// route for generating code using AI
fileApp.post('/generate-code', verifyToken, async (req, res) => {
    try {
        const { prompt, currentCode } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        const generatedCode = await generateCodeService(prompt, currentCode);

        return res.status(200).json({
            message: "Code generated successfully",
            payload: { generatedCode }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error generating code",
            error: err.message
        });
    }
});