const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

const secret = process.env.JWT_SECRET

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    // Get the username and password from the request body
    
    // Check that a user with that username exists in the database
    const existsUser = await prisma.user.findUnique({
        where : { username }
    })

    if(!existsUser) {
        return res.status(401).json({error : "Invalid username or password"})
    }

    try {
        const passwordMatch = await bcrypt.compare(password, existsUser.password)

        if(!passwordMatch) {
            return res.status(401).json({error : "Invalid username or password"})
        }

        const token = jwt.sign(existsUser.username, secret)
        return res.status(200).json({token})
    } catch (error) {
        return res.status(500).json({error : 'An error occured during login'})
    }
    // Use bcrypt to check that the provided password matches the hashed password on the user
    // If either of these checks fail, respond with a 401 "Invalid username or password" error

    // If the user exists and the passwords match, create a JWT containing the username in the payload
    // Use the JWT_SECRET environment variable for the secret key

    // Send a JSON object with a "token" key back to the client, the value is the JWT created
});

module.exports = router;
