const express = require('express');
const router = express.Router();
const User = require('../models/User');

// get all
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// get one
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// create one
router.post('/', async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        type: 'staff',
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});

// update
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName;
    }
    if (req.body.username != null) {
        // TODO: IMPORTANT: first do check to see if already exists
        res.user.username = req.body.username;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
});

// delete
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({
            message: 'User deleted successfully.'
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
});


// middleware that gets a user

async function getUser(req, res, next) {
    let user;

    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({
                message: `Cannot find user with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.user = user
    next();
}


module.exports = router;