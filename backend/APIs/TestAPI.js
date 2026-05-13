// a route to get demo data to test

import exp from 'express';

export const testApp = exp.Router()

// route for testing
testApp.get('/test', (req, res) => {
    res.status(200).json({ message: "Test API is working", data: "test" })
})
