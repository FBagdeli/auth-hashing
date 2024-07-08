const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma.js')

router.post('/', async (req, res) => {
    // Get the username and password from request body
    const {username , password } = req.body

    try {
        const userExist = await prisma.user.findUnique({
            where : { username }
        })
        if(userExist) {
            return res.status(400).json({error : 'Username already exist'})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await prisma.user.create({
            data : {
                username,
                password : hashedPassword
            }
        })

        return res.status(201).json({user : {
            id: newUser.id, 
            username : newUser.username
        }})
    } catch (error) {
        res.status(500).json({ error : 'Failed to create User'})
    }
});

module.exports = router;
