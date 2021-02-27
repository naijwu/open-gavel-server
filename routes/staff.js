const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const Committee = require('../models/Committee');
const verify = require('../middleware/authVerify');
const roleSecVerify = require('../middleware/roleSecVerify');
// const bcrypt = require('bcryptjs'); // only for hashing passwords


// API calls that SECRETARIATS would use (all must have valid JWToken -- private routes hehe)


// TODO: DELETE THIS -- token experimentation 
router.get('/', verify, roleSecVerify, (req, res) => {
    res.send(req.tokenData);
})


// create staff account
router.post('/', verify, roleSecVerify, async (req, res) => {

    const staffInConference = await Staff.find({ conference: req.body.conference });

    staffInConference.forEach((staff) => {
        if(staff.username === req.body.username) {
            return res.status(400).json({ message: 'Account with the username already exists'});
        }
    });

    // Hash the password 
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);


    // Create a committee (committee._id has to be linked to staff)
    const linkedCommittee = new Committee({
        statistics: {
            mod_no: '',
            mod_minutes: '',
            unmod_no: '',
            unmod_minutes: '',
            primary_no: '',
            primary_minutees: '',
            secondary_no: '',
            secondary_minutes: '',
        },
        countries: [],
    })

    try {

        // Save committee object to database
        const newCommittee = await linkedCommittee.save();

        // Create a staff object
        const staff = new Staff({
            committee: req.body.committee,
            username: req.body.username,
            // password: hashedPassword,
            password: req.body.password,
            conference: req.body.conference, 
            conference_id: req.body.conference.toLowerCase().replace(/\s/g, ''),
            type: 'staff',
            committee_id: newCommittee._id,
        });
    
        try {
            // save new staff to database
            const newStaff = await staff.save();
            res.status(201).json(newStaff);
        } catch (err) {
            res.status(400).json({
                message: err.message,
            });
        }

    } catch(error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

// get all staff of conference
router.get('/:conference', verify, roleSecVerify, async (req, res) => {
    try {
        const staffs = await Staff.find({ conference: req.params.conference });
        res.json(staffs);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// update
router.post('/:id', verify, roleSecVerify, getUser, async (req, res) => {
    
    // update values of staff with the ID
    res.user.username = req.body.username;
    res.user.password = req.body.password;
    res.user.committee = req.body.committee;

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
router.delete('/:id', verify, roleSecVerify, getUser, async (req, res) => {

    try {
        await Committee.findById(res.user.committee_id).deleteOne();

        try {
            await res.user.remove();
        
            res.json({
                message: 'Committee account and data deleted successfully.'
            })
        } catch (err) {
            res.status(500).json({
                message: 'Error during committee deletion ' + err.message,
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
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

module.exports = router;