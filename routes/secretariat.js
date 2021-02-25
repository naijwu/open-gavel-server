const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const Secretariat = require('../models/Secretariat');
const verify = require('../middleware/authVerify');
const roleSecVerify = require('../middleware/roleSecVerify');
const jwt = require('jsonwebtoken');


// update
router.patch('/:id', verify, roleSecVerify, getUser, async (req, res) => {

    const secInDB = await Secretariat.findById(req.params.id);
    
    // check for conference already existing
    if (req.body.email != null) {
        const emailExists = await Secretariat.findOne({email: req.body.email});
        if(emailExists) return res.status(400).json({ message: 'Email is already registered'});

        res.secretariat.email = req.body.email;
    } 

    if (req.body.conference != null) {
        // Check if duplicates among secretariat accounts
        const conferenceExists = await Secretariat.findOne({conference: req.body.conference});
        if(conferenceExists) return res.status(400).json({ message: 'Conference is already registered'});

        // no duplicates, good to change
        res.secretariat.conference = req.body.conference;

        // find all staff of pre-change conferences
        const staffInConference = await Staff.find({ conference: secInDB.conference }); 

        // rename all users
        staffInConference.forEach(async (staff) => {

            // going through each user to change... 
            try {
                let staffInDB = await Staff.findById(staff._id);
                let newStaff = staffInDB;
    
                newStaff.conference = req.body.conference;
                newStaff.conference_id= req.body.conference.toLowerCase().replace(/\s/g, '');
    
                let savedStaff = await newStaff.save();
            } catch(findError) {
                return res.status(500).json({
                    message: findError.message
                })
            }
        });

    } 

    if (req.body.firstName != null) {
        // TODO: IMPORTANT: first do check to see if already exists
        res.secretariat.firstName = req.body.firstName;
    } 

    if (req.body.lastName != null) {
        // TODO: IMPORTANT: first do check to see if already exists
        res.secretariat.lastName = req.body.lastName;
    } 

    try {
        const updatedSecretariat = await res.secretariat.save();

        const token = jwt.sign({
            // information that will be available for user
            _id: updatedSecretariat._id,
            conference: updatedSecretariat.conference,
            type: updatedSecretariat.type,
            firstName: updatedSecretariat.firstName,
            lastName: updatedSecretariat.lastName,
            email: updatedSecretariat.email
        }, process.env.TOKEN_SECRET);

        res.json({
            updatedSecretariat,
            token: token,
        });
    } catch(err) {
        res.status(400).json({
            message: err.message
        });
    }
});


// delete
router.delete('/:id', verify, roleSecVerify, getUser, async (req, res) => {
    try {
        await res.secretariat.remove();
        res.send('User Deleted');
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
});


async function getUser(req, res, next) {
    let secretariat;

    try {
        secretariat = await Secretariat.findById(req.params.id);
        if (secretariat == null) {
            return res.status(404).json({
                message: `Cannot find secretariat with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.secretariat = secretariat;
    next();
}



module.exports = router;