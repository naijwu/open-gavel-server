const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');
const verify = require('../middleware/authVerify');


router.get('/:id', verify, getCommittee, (req, res) => {
    res.json(res.comm);
});


// update
router.post('/:id', verify, getCommittee, async (req, res) => {
    
    // update values of committee with the ID to the sent information
    res.comm.countries = req.body.countries;
    res.comm.statistics = req.body.statistics;

    try {
        const updatedComm = await res.comm.save();
        res.json(updatedComm);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
});


async function getCommittee(req, res, next) {
    let committee;

    try {
        committee = await Committee.findById(req.params.id);
        if (committee == null) {
            return res.status(404).json({
                message: `Cannot find committee with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.comm = committee;
    next();
}


module.exports = router;