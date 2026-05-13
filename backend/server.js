import exp from 'express'
import cookieParser from 'cookie-parser'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { authApp } from './APIs/authAPI.js'
import { repoApp } from './APIs/RepoAPI.js'
import { fileApp } from './APIs/FileAPI.js'
import { collabApp } from './APIs/CollabAPI.js'
import { userApp } from './APIs/UserAPI.js'
import { commitApp } from './APIs/CommitAPI.js'
import { branchApp } from './APIs/BranchAPI.js'
import { prApp } from './APIs/prAPI.js'
import { testApp } from './APIs/TestAPI.js'
import cors from 'cors'

config()

export const app = exp()
const port = process.env.PORT || 3000

//==================== middleware =======================
app.use(exp.json())
app.use(cookieParser())

// to allow frontend application to send requests to backend
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))

app.use('/api/auth', authApp)
app.use('/api/users', userApp)
app.use('/api/repository', repoApp)
app.use('/api/files', fileApp)
app.use('/api/collaborator', collabApp)
app.use('/api/commits', commitApp)
app.use('/api/branches', branchApp)
app.use('/api/pull-requests', prApp)
app.use('/api/test', testApp)
//=======================================================

//_____________________start server_______________________________
app.listen(port, () => console.log(`Server running on port ${port}`))
//================================================================


//_________________connect to DB server___________________________
async function connectDB() {
    try {
        await connect(process.env.MONGO_DB_URI);
        console.log("DB connection established")
    }
    catch (err) {
        console.log(err)
    }
}
connectDB()

// error handling middleware   ----> at the end of the file
// NOTE: error => {name,message,callstack}
app.use((err, req, res, next) => {
    console.log(err.name)
    //Validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "error occurred", error: err.name })
    }
    //CastError
    if (err.name === 'CastError') {
        return res.status(400).json({ message: "error occurred", error: err.name })
    }

    //Server side error
    res.status(500).json({ message: "Error occurred in server", error: err })
})