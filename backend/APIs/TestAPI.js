import exp from 'express'
import { UserModel } from '../models/UserModel.js'

export const testApp = exp.Router()

testApp.get('/demo', async (req, res) => {

    try {

        const users = await UserModel.find()

        res.status(200).json({
            message: "Test API is working",
            data: users
        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Database Error",
            error: err.message
        })

    }

})