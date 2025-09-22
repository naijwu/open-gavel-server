const express = require('express');
const router = express.Router();
const Committee = require('../models/Committee');
const verify = require('../middleware/authVerify');
const { uploadImage } = require('../lib/firebase');

const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory as buffers
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Only allow image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });


router.get('/:id', verify, getCommittee, (req, res) => {
    res.json(res.comm);
});


// update
router.post('/:id', verify, getCommittee, async (req, res) => {
    
    // update values of committee with the ID to the sent information
    if(req.body.countries) {
        res.comm.countries = req.body.countries;
    }
    if(req.body.statistics) {
        res.comm.statistics = req.body.statistics;
    }
    if(req.body.settings) {
        res.comm.settings = req.body.settings;
    }

    try {
        const updatedComm = await res.comm.save();
        res.json(updatedComm);
    } catch(err) {
        res.status(400).json({
            message: err.message
        })
    }
});


// hotadd: upload country image
router.post('/:id/country/:country_name/upload-image', verify, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No image file provided'
            });
        }
        const downloadURL = await uploadImage(req.params.id, req.params.country_name, req.file);
        if (downloadURL) {
            res.json({
                message: 'Image uploaded successfully',
                downloadURL: downloadURL
            });
        } else {
            res.status(500).json({
                message: 'Failed to upload image'
            });
        }
    } catch(err) {
        res.status(400).json({
            message: err.message
        });
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