const express = require('express');
const upload = require('../fileupload/upload')
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

const URI = 'mongodb+srv://arya123:arya123@multer-file-upload.q7myhx8.mongodb.net/?retryWrites=true&w=majority';
const conn = mongoose.createConnection(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


let gridFSBucket;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    // add value to new var
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});



router.get('/', (req, res) => {
    res.render('index');
})

router.post('/upload', upload.single('file'), async (req, res) => {
    try{
        const newUser = await User({name: req.body.name, profilephoto: `http://localhost:5000/image/${req.file.filename}`}).save();
        console.log(newUser);
        return res.status(200).send("Success");
    }
    catch(error){
        console.log(error);
    }
})


router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files'
            })
        }
        return res.json(files);
    })
})

router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        return res.json(file);
    });
});

router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readStream = gridFSBucket.openDownloadStream(file._id);
            readStream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            })
        }
    });
});

module.exports = router;