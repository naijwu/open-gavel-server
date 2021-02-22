const express = require('express');
const router = express.Router();
const Secretariat = require('../models/Secretariat');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

// register on website (register as secretariat)
router.post('/secretariat/register', async (req, res) => {

    // TODO: VALIDATE & CLEAN data


    // Check for email already existing
    const emailExists = await Secretariat.findOne({email: req.body.email});
    if(emailExists) return res.status(400).json({ message: 'Account with the email already exists'});

    // check for conference already existing
    const conferenceExists = await Secretariat.findOne({conference: req.body.conference});
    if(conferenceExists) return res.status(400).json({ message: 'Conference is already registered'});


    // Hash the password
    const salt = await bcrypt.genSalt(10); // 'be a salt on earth' or something like that
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Finally create the user
    const secretariat = new Secretariat({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        conference: req.body.conference,
        type: 'secretariat',
    });

    // save into the database
    try {
        const savedSecretariat = await secretariat.save();
        res.status(201).json(savedSecretariat);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
});


// login as secretariat
router.post('/secretariat/login', async (req, res) => {
    // input: email, password

    // TODO: VALIDATE & CLEAN input


    // Check if email exists
    const secInDB = await Secretariat.findOne({email: req.body.email});
    if(!secInDB) return res.status(400).json({message: 'Email or password is wrong'});
    
    // Check if password is valid
    const validPass = await bcrypt.compare(req.body.password, secInDB.password)
    if(!validPass) return res.status(400).send('Email or password is wrong');

    
    // Makes pass -- Now, create and assign a token
    const token = jwt.sign({
        // information that will be available for user
        _id: secInDB._id,
        conference: secInDB.conference,
        type: secInDB.type,
        firstName: secInDB.firstName,
        lastName: secInDB.lastName,
        email: secInDB.email
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});


// login as staff

router.post('/staff/login', async (req, res) => {
    // input: username, conference, password

    // TODO: VALIDATE & CLEAN input


    // Narrow down down to staff in conference
    const staffInConference = await Staff.find({ conference_id: req.body.conference.toLowerCase() });

    // check if username exists
    const staffInDB = staffInConference.find(x => x.username === req.body.username);

    if(!staffInDB) return res.status(400).json({message: 'Username or password is wrong'});
    
    // Check if password is valid
    // const validPass = await bcrypt.compare(req.body.password, staffInDB.password) // Plain text
    const validPass = (staffInDB.password === req.body.password);
    if(!validPass) return res.status(400).send('Username or password is wrong');

    
    // Makes pass -- Now, create and assign a token
    const token = jwt.sign({
        _id: staffInDB._id,
        conference: staffInDB.conference,
        committee: staffInDB.committee,
        type: 'staff',
        // also will have to add the OG states
    }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});




module.exports = router;