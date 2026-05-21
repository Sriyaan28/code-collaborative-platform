import exp from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'

import { authApp } from './APIs/authAPI.js'
import { repoApp } from './APIs/RepoAPI.js'
import { fileApp } from './APIs/FileAPI.js'
import { collabApp } from './APIs/CollabAPI.js'
import { userApp } from './APIs/UserAPI.js'
import { commitApp } from './APIs/CommitAPI.js'
import { branchApp } from './APIs/BranchAPI.js'
import { prApp } from './APIs/prAPI.js'
import { testApp } from './APIs/TestAPI.js'
import { notificationApp } from './APIs/NotificationAPI.js'
import { issueApp } from './APIs/IssuesAPI.js'
import { commentApp } from './APIs/CommentAPI.js'
import { discussionApp } from './APIs/DiscussionsAPI.js'

config()

export const app = exp()

const port = process.env.PORT || 8080

// =====================================================
// ENVIRONMENT CHECK
// =====================================================

const STATE = process.env.STATE || "DEVELOPMENT"

console.log("CURRENT STATE:", STATE)

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(exp.json())

app.use(cookieParser())

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://code-collaborative-platform.vercel.app'
    ],
    credentials: true
}))

// =====================================================
// DATABASE CONNECTION
// =====================================================

let isConnected = false

async function connectDB() {

    if (isConnected) {

        console.log("Using Existing DB Connection")

        return

    }

    try {

        const db = await mongoose.connect(
            process.env.MONGO_DB_URI
        )

        isConnected = db.connections[0].readyState

        console.log("DB Connection Established")

    }
    catch (err) {

        console.log("DB CONNECTION ERROR:", err)

    }

}

// =====================================================
// CONNECT DATABASE
// =====================================================

await connectDB()

// =====================================================
// ROUTES
// =====================================================

app.use('/api/auth', authApp)

app.use('/api/users', userApp)

app.use('/api/repository', repoApp)

app.use('/api/files', fileApp)

app.use('/api/collaborator', collabApp)

app.use('/api/commits', commitApp)

app.use('/api/branches', branchApp)

app.use('/api/pull-requests', prApp)

app.use('/api/notifications', notificationApp)

app.use('/api/issues', issueApp)

app.use('/api/comments', commentApp)
app.use('/api/discussions', discussionApp)

app.use('/api/test', testApp)



// =====================================================
// LOCAL SERVER ONLY
// =====================================================

if (STATE === "DEVELOPMENT") {

    app.listen(port, () => {

        console.log(
            `Server Running Locally On Port ${port}`
        )

    })

}

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.log("ERROR:", err)

    if (err.name === 'ValidationError') {

        return res.status(400).json({
            message: "Validation Error",
            error: err.message
        })

    }

    if (err.name === 'CastError') {

        return res.status(400).json({
            message: "Cast Error",
            error: err.message
        })

    }

    res.status(500).json({
        message: "Server Error",
        error: err.message
    })

})

// Global handlers for unexpected errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});

export default app