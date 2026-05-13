// a route to get demo data to test

import exp from 'express';
import { UserModel } from '../models/UserModel.js';

export const testApp = exp.Router()

// route for testing
testApp.get('/demo', async (req, res) => {
    // fetch all profiles from db
    const users = await UserModel.find();
    if (!users) {
        return res.status(404).json({ message: "No users found" })
    }
    console.log(users)
    res.status(200).json({ message: "Test API is working", data: users })
    console.log("test API is working")
})
