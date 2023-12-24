const express = require('express');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = "Up78@2051verysecret";

const router = express.Router();

// ROUTE 1: Create a new User using name, email, password - POST /api/auth/createUser - No login required
router.post('/createUser', [
    body('name', 'Name should be atleast 3 characters.').isLength({ min: 3 }),
    body('email', 'Please enter a valid email.').isEmail(),
    body('password', 'Password should  be minimum 5 charracters.').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Check  for errors in incoming data
            return res.status(400).json({ error: "Please check your input", details: errors.array() });
        } else {
            // Check weither a User with this email already  exists
            let oldUser = await User.findOne({ email: req.body.email });
            if (oldUser) {
                return res.status(400).json({ error: "Sorry a user with this e-mail already exists." });
            } else {
                // Incoming data verification complete. Creating user....
                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(req.body.password, salt);
                let newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass
                });
                await newUser.save();
                const data = {
                    user: newUser.id
                }
                console.log(data);
                const token = jwt.sign(data, JWT_SECRET);
                return res.json({ success: true, token: token })
            }
        }
    } catch (err) {
        //  For other errors
        console.error(err);
        return res.status(500).json({ error: "Server side error", details:err })
    }
});


// ROUTE  2: Authenticate a user with email and password - POST /api/auth/loginUser - Does not require login
router.post('/loginUser', [
    body('email', 'Please enter a valid email.').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Check  for errors in incoming data
        // NOTE: Use 'return' keyword when sending data back to user.
        return res.status(400).json({ error: "Please check your input", details: errors.array() });
    } else {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Please use correct credentials." });
            } else {
                const passwordCompare = await bcrypt.compare(password, user.password);
                if (!passwordCompare) {
                    return res.status(400).json({ error: "Please use correct credentials." });
                } else {
                    const data = {
                        user: user.id // NEVER use _id here
                    }
                    console.log(data);
                    const token = jwt.sign(data, JWT_SECRET);
                    return res.json({ success: true, token: token })
                }
            }
        } catch (err) {
            //  For other errors
            console.error(err);
            return res.status(500).json({ error: "Server side error",  details: err })
        }
    }
});

// ROUTE  3: Get logged in user details using token - POST /api/auth/getUser - Requires loggin
router.get('/getUser', fetchuser, async (req, res) => {
    try{
        const user = await User.findById(req.user).select('-password');
        res.json({success: true, data: user});
    } catch {
        console.error(err);
        return res.status(500).json({ error: "Server side error",  details:err })
    }
});


module.exports = router;