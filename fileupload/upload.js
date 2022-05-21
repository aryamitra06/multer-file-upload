const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const URI = 'mongodb+srv://arya123:arya123@multer-file-upload.q7myhx8.mongodb.net/?retryWrites=true&w=majority';
const conn = mongoose.createConnection( URI , { useNewUrlParser : true, useUnifiedTopology : true } )

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

// creating storage engine
var storage = new GridFsStorage({
    url: URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage }); //upload is working as a middleware here!

module.exports = upload;