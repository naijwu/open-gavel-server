const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const verify = require('./authVerify');

// API calls that SECRETARIATS would use (all must have valid JWToken -- private routes hehe)


// TODO: DELETE THIS -- token experimentation 
router.get('/', verify, bigBoyTable, (req, res) => {
    res.send(req.tokenData);
})


// create staff account
router.post('/', verify, bigBoyTable, async (req, res) => {
    const staff = new Staff({
        username: req.body.firstName,
        password: req.body.password,
        conference: req.body.conference, // data will be stored in JWT in the front-end
        type: 'staff',
    });

    try {
        const newStaff = await staff.save();
        res.status(201).json(newStaff)
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});

// get all staff of conference
router.get('/:conference', verify, bigBoyTable, async (req, res) => {
    try {
        const staffs = await Staff.find({ conference: req.body.conference });
        res.json(staffs);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// update
router.patch('/:id', verify, bigBoyTable, getUser, async (req, res) => {
    if (req.body.username != null) {
        // TODO: IMPORTANT: first do check to see if already exists
        res.user.username = req.body.username;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }

    try {
        const updatedStaff = await res.user.save();
        res.json(updatedStaff);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
});

// delete
router.delete('/:id', verify, bigBoyTable, getUser, async (req, res) => {
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
    let staff;

    try {
        staff = await Staff.findById(req.params.id);
        if (staff == null) {
            return res.status(404).json({
                message: `Cannot find staff with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.user = staff
    next();
}

function bigBoyTable(req, res, next) {
    // checks if user is a secretariat (or above) ... staff only have power to manage committees

    if (!(req.tokenData.type === 'secretariat' || req.tokenData.type === 'legend')) return res.status(401).send('Insufficient power. Hit the gym more often. (Insufficient permissions)');

    next();
}

module.exports = router;